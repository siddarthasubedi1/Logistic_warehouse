export default function RoomNavigation({ scenes, sceneIndex, onPrevious, onNext }) {
    if (!Array.isArray(scenes) || scenes.length < 2) return null;

    // With only two areas, Previous and Next point to the same destination.
    // Showing one clear switch button is cleaner and avoids duplicate controls.
    if (scenes.length === 2) {
        const otherIndex = sceneIndex === 0 ? 1 : 0;
        const other = scenes[otherIndex];
        const onSwitch = otherIndex > sceneIndex ? onNext : onPrevious;

        return (
            <nav className="immersive-room-navigation immersive-room-navigation--single" aria-label="Training areas">
                <button
                    type="button"
                    className="immersive-room-link immersive-room-link--switch"
                    onClick={onSwitch}
                    aria-label={`Switch area to ${other.name}`}
                    title={other.name}
                >
                    <span className="immersive-room-link__copy">
                        <small>Switch training area</small>
                        <b>{other.name}</b>
                    </span>
                    <span className="immersive-room-link__arrow" aria-hidden="true">→</span>
                </button>
            </nav>
        );
    }

    const previous = scenes[(sceneIndex - 1 + scenes.length) % scenes.length];
    const next = scenes[(sceneIndex + 1) % scenes.length];

    return (
        <nav className="immersive-room-navigation" aria-label="Training areas">
            <button type="button" className="immersive-room-link" onClick={onPrevious}
                aria-label={`Previous area: ${previous.name}`} title={previous.name}>
                <span className="immersive-room-link__arrow" aria-hidden="true">←</span>
                <span className="immersive-room-link__copy"><small>Previous area</small><b>{previous.name}</b></span>
            </button>
            <button type="button" className="immersive-room-link immersive-room-link--next" onClick={onNext}
                aria-label={`Next area: ${next.name}`} title={next.name}>
                <span className="immersive-room-link__copy"><small>Next area</small><b>{next.name}</b></span>
                <span className="immersive-room-link__arrow" aria-hidden="true">→</span>
            </button>
        </nav>
    );
}
