// Dependency-free controller regression tests. Database boundaries are stubbed;
// these supplement, and do not replace, the MongoDB integration suite.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
function fixture({ assigned = true, rows = [], elapsed = 10 } = {}) {
  const programme = { _id: 'programme', level: 'beginner', programmeType: 'manual-handling' };
  const puzzle = { programme: 'programme', status: 'active', type: 'sequence', digitalProps: [{id:'a',label:'Check'},{id:'b',label:'Act'}], expectedSolution:['a','b'], correctFeedback:'Correct', incorrectFeedback:'Incorrect' };
  const challenge = { _id: 'challenge', puzzle, timeLimitSeconds:60, basePoints:800, maxTimeBonus:200, maxScore:1000, hintPenalty:40, incorrectPenalty:40 };
  const attempt = { startedAt:new Date(Date.now()-elapsed*1000), result:'in-progress',validityStatus:'pending', hintsUsed:0, save:async()=>{} };
  let pipeline;
  const models = {
    Challenge:{ findOne:()=>({populate:async()=>challenge}) },
    TrainingProgramme:{findOne:async()=>programme},
    TrainingAssignment:{findOne:async()=>assigned ? {} : null},
    TrainingProgress:{findOne:()=>({lean:async()=>({basicPassed:true})})},
    ChallengeAttempt:{findOne:async()=>attempt,aggregate:async p=>{pipeline=p;return rows;}},
    PersonalBest:{findOne:async()=>null,findOneAndUpdate:async()=>({score:attempt.score})},
  };
  const exports = {};
  const sandbox = { exports, console, require(name) {
    if(name==='mongoose') { function ObjectId(value) { this.value=value; } ObjectId.isValid=v=>!!v; return {Types:{ObjectId}}; }
    if(name.includes('/models/')) return models[name.split('/').at(-1)] || {};
    if(name.includes('traineeLevelProgressService')) return {syncUnlockedProgressionAssignments:async()=>{},normalizeProgrammeLevel:v=>v};
    return {};
  }};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../src/controllers/sprint3ChallengeController.js'),'utf8'),sandbox);
  const req={params:{id:'challenge'},query:{},user:{id:'trainee'},body:{attemptId:'attempt',answers:['a','b']}};
  const res={code:200,status(v){this.code=v;return this},set(){return this},json(v){this.body=JSON.parse(JSON.stringify(v));return this}};
  return {controller:exports, req,res,attempt,puzzle,models,pipeline:()=>pipeline};
}
test('leaderboard returns only rank and score, with tied ranks',async()=>{
 const f=fixture({rows:[{score:1000,_id:'private',email:'secret'},{score:1000},{score:800}]});
 await f.controller.leaderboard(f.req,f.res);
 assert.deepEqual(f.res.body.entries,[{rank:1,score:1000},{rank:1,score:1000},{rank:3,score:800}]);
 const p=f.pipeline();
 assert.equal(p[0].$match.accuracy,1);assert.equal(p[0].$match.result,'completed');
 assert.equal(p[1].$group._id,'$trainee');assert.equal(p[2].$sort.score,-1);
});
test('unassigned trainee cannot read scores',async()=>{
 const f=fixture({assigned:false});await f.controller.leaderboard(f.req,f.res);assert.equal(f.res.code,403);assert.equal(f.pipeline(),undefined);
});
test('incorrect order earns zero',async()=>{
 const f=fixture();f.req.body.answers=['b','a'];await f.controller.submitChallenge(f.req,f.res);assert.equal(f.res.code,200);assert.equal(f.res.body.attempt.score,0);assert.equal(f.res.body.exact,false);
});
test('correct order after timeout earns zero and is not shown as successful',async()=>{
 const f=fixture({elapsed:70});await f.controller.submitChallenge(f.req,f.res);assert.equal(f.res.code,200);assert.equal(f.res.body.exact,false);assert.equal(f.res.body.attempt.score,0);assert.equal(f.res.body.attempt.result,'timeout');
});
test('correct timely answer earns calculated points',async()=>{
 const f=fixture();await f.controller.submitChallenge(f.req,f.res);assert.equal(f.res.code,200);assert.equal(f.res.body.exact,true);assert.ok(f.res.body.attempt.score>0 && f.res.body.attempt.score<=1000);
});
test('duplicate submission rejected',async()=>{
 const f=fixture();f.attempt.result='completed';await f.controller.submitChallenge(f.req,f.res);assert.equal(f.res.code,409);
});
test('duplicate cards rejected',async()=>{
 const f=fixture();f.req.body.answers=['a','a'];await f.controller.submitChallenge(f.req,f.res);assert.equal(f.res.code,400);
});

function matchingFixture() {
 const f=fixture();
 f.puzzle.type='matching'; f.puzzle.targets=[{id:'left',label:'Situation one'},{id:'right',label:'Situation two'}];
 f.puzzle.expectedSolution={left:'a',right:'b'};
 return f;
}
test('correct prop placement scores and returns explanatory matches',async()=>{
 const f=matchingFixture();f.req.body.answers={left:'a',right:'b'};
 await f.controller.submitChallenge(f.req,f.res);assert.equal(f.res.code,200);assert.equal(f.res.body.exact,true);assert.equal(f.res.body.matchingAnswer.length,2);
});
test('wrong but complete prop placement scores zero',async()=>{
 const f=matchingFixture();f.req.body.answers={left:'b',right:'a'};
 await f.controller.submitChallenge(f.req,f.res);assert.equal(f.res.code,200);assert.equal(f.res.body.attempt.score,0);
});
test('incomplete prop placement rejected without finishing attempt',async()=>{
 const f=matchingFixture();f.req.body.answers={left:'a'};
 await f.controller.submitChallenge(f.req,f.res);assert.equal(f.res.code,400);assert.equal(f.attempt.result,'in-progress');
});
test('same prop cannot fill two targets',async()=>{
 const f=matchingFixture();f.req.body.answers={left:'a',right:'a'};
 await f.controller.submitChallenge(f.req,f.res);assert.equal(f.res.code,400);
});
test('unknown target cannot be injected',async()=>{
 const f=matchingFixture();f.req.body.answers={left:'a',right:'b',extra:'a'};
 await f.controller.submitChallenge(f.req,f.res);assert.equal(f.res.code,400);
});

test('incomplete prop placement after timeout finishes with zero',async()=>{
 const f=matchingFixture();f.attempt.startedAt=new Date(Date.now()-70000);f.req.body.answers={};
 await f.controller.submitChallenge(f.req,f.res);assert.equal(f.res.code,200);assert.equal(f.res.body.attempt.result,'timeout');assert.equal(f.res.body.attempt.score,0);
});
test('hints cannot deduct the base score of a correct solution',async()=>{
 const f=fixture();f.attempt.hintsUsed=100;
 await f.controller.submitChallenge(f.req,f.res);assert.equal(f.res.code,200);assert.equal(f.res.body.attempt.score,800);
});
test('competing attempt save returns conflict',async()=>{
 const f=fixture();f.attempt.save=async()=>{const e=new Error('competing save');e.name='VersionError';throw e;};
 await f.controller.submitChallenge(f.req,f.res);assert.equal(f.res.code,409);assert.equal(f.res.body.code,'ATTEMPT_CHANGED');
});

test('lower replay never writes over the saved personal best',async()=>{
 const f=fixture();const previous={score:1000};let writes=0;
 f.models.PersonalBest.findOne=async()=>previous;
 f.models.PersonalBest.findOneAndUpdate=async()=>{writes++;throw new Error('should not write');};
 await f.controller.submitChallenge(f.req,f.res);
 assert.equal(f.res.code,200);assert.equal(writes,0);assert.equal(f.res.body.personalBestUpdated,false);assert.equal(f.res.body.personalBest.score,1000);
});
test('equal replay keeps the same saved record',async()=>{
 const f=fixture({elapsed:0});f.models.PersonalBest.findOne=async()=>({score:1000});let writes=0;
 f.models.PersonalBest.findOneAndUpdate=async()=>{writes++;};
 await f.controller.submitChallenge(f.req,f.res);assert.equal(f.res.code,200);assert.equal(writes,0);assert.equal(f.res.body.personalBestUpdated,false);
});
test('higher replay uses an atomic comparison and improves the best',async()=>{
 const f=fixture();f.models.PersonalBest.findOne=async()=>({score:300});let filter;
 f.models.PersonalBest.findOneAndUpdate=async q=>{filter=q;return {score:f.attempt.score};};
 await f.controller.submitChallenge(f.req,f.res);assert.equal(f.res.code,200);assert.equal(f.res.body.personalBestUpdated,true);assert.ok(f.res.body.personalBest.score>300);assert.equal(filter.$or[0].score.$lt,f.attempt.score);
});
test('first-score insert race retries the higher score comparison',async()=>{
 const f=fixture();let writes=0;
 f.models.PersonalBest.findOneAndUpdate=async(q,u,options)=>{writes++;if(writes===1){const e=new Error('insert race');e.code=11000;throw e;}assert.equal(options.upsert,undefined);return {score:f.attempt.score};};
 await f.controller.submitChallenge(f.req,f.res);assert.equal(f.res.code,200);assert.equal(writes,2);assert.equal(f.res.body.personalBestUpdated,true);
});
test('cumulative scoreboard exposes only profile, name and total score',async()=>{
 const f=fixture();let pipeline;
 f.models.PersonalBest.aggregate=async p=>{pipeline=p;return [{entries:[{name:'Sakar Gurung',profileImage:'/uploads/profiles/sakar.jpg',highScore:1100,email:'private',_id:'hidden'}],mine:[{highScore:1000,puzzlesCompleted:2}],count:[{total:1}]}];};
 await f.controller.totalScores(f.req,f.res);assert.equal(f.res.code,200);
 assert.deepEqual(f.res.body.entries,[{name:'Sakar Gurung',profileImage:'/uploads/profiles/sakar.jpg',highScore:1100}]);
 assert.equal(f.res.body.myScore.highScore,1000);assert.equal(f.res.body.myScore.puzzlesCompleted,2);
 assert.equal(pipeline[1].$group._id.puzzle,'$puzzle');assert.equal(pipeline[1].$group.score.$max,'$score');assert.equal(pipeline[2].$group.highScore.$sum,'$score');assert.equal(pipeline[5].$sort.highScore,-1);
 assert.equal(pipeline[3].$lookup.pipeline[0].$match.role,'trainee');assert.equal(pipeline[3].$lookup.pipeline[0].$match.status,'active');
});
test('score pagination rejects manipulated page values',async()=>{
 const f=fixture();f.req.query.page='-1';await f.controller.totalScores(f.req,f.res);assert.equal(f.res.code,400);
});
