const fs=require('fs'),path=require('path'),ModuleLoader=require('module');
const root=path.resolve(__dirname,'..');
const mongoose=require(path.join(root,'node_modules/mongoose'));
const {MongoMemoryServer}=require(path.join(root,'node_modules/mongodb-memory-server'));
const model=name=>require(path.join(root,'src/models',name));
async function main(){
 const mongo=await MongoMemoryServer.create({instance:{args:['--nounixsocket']}});await mongoose.connect(mongo.getUri());
 const keys=['manual-handling','working-at-height','cyber-awareness'];
 const admin=await model('User').create({firstName:'Benchmark',lastName:'Admin',email:'benchmark-admin@example.invalid',role:'admin',status:'active',accountStatus:'created',mustChangePassword:false});
 const trainee=await model('User').create({firstName:'Benchmark',lastName:'Trainee',email:'benchmark-trainee@example.invalid',role:'trainee',status:'active',accountStatus:'created',mustChangePassword:false,assignedTrainingSections:keys,age:25,phoneNumber:'9800000000',address:'Kathmandu',gender:'female',createdBy:admin._id});
 for(const key of keys){await model('TrainingModule').create({key,code:key,name:key,description:'Benchmark training module description.',createdBy:admin._id});for(const level of ['beginner','intermediate','advanced']){const p=await model('TrainingProgramme').create({programmeType:key,level,title:`${key} ${level}`,shortDescription:'Benchmark training programme.',description:'Benchmark testing of stored progress calculations.',learningObjectives:'Review and complete required training activities.',owner:admin._id,passMark:70,createdBy:admin._id});await model('TrainingAssignment').create({trainee:trainee._id,programme:p._id,assignedBy:admin._id});for(let order=1;order<=4;order++)await model('LearningSection').create({programme:p._id,title:`Topic ${order}`,content:'Stored required learning content for benchmarking.',order,status:'active',createdBy:admin._id});}}
 const currentService=require(path.join(root,'src/services/progressOverviewService'));
 let old=null;
 if(process.argv[2]){const filename=path.join(root,'src/services/baselineProgressForBenchmark.js');const loader=new ModuleLoader(filename,module);loader.filename=filename;loader.paths=ModuleLoader._nodeModulePaths(path.dirname(filename));loader._compile(fs.readFileSync(path.resolve(process.argv[2]),'utf8'),filename);old=()=>loader.exports.getTraineeModuleProgress(trainee._id);}
 const current=()=>currentService.ownOverview(trainee._id);
 await Promise.all(Object.values(mongoose.models).map(model=>model.init()));
 async function measure(fn){await fn();const runs=[];for(let i=0;i<5;i++){let queries=0;mongoose.set('debug',()=>queries++);const start=performance.now();await fn();runs.push({ms:+(performance.now()-start).toFixed(2),databaseOperations:queries});mongoose.set('debug',false);}const median=runs.map(r=>r.ms).sort((a,b)=>a-b)[2];return {runs,medianMs:median,medianDatabaseOperations:runs.map(r=>r.databaseOperations).sort((a,b)=>a-b)[2]};}
 const result={fixture:{trainees:1,modules:3,programmes:9,requiredSections:36,attempts:0},runtime:process.version,baseline:old?await measure(old):null,sprint4:await measure(current),notes:'Warm-cache local in-memory MongoDB; indexes initialized before measurement, one warm-up and five sequential runs per implementation. Original archived module-progress service (when supplied) versus Sprint 4 overview. This is a small fixture, not a production capacity test.'};
 fs.writeFileSync(path.join(root,'docs/PERFORMANCE_MEASUREMENTS.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 await mongoose.disconnect();await mongo.stop();
}
main().catch(e=>{console.error(e);process.exit(1);});
