import './tournamentCard.scss'

export function TournamentCard({id, title, format, date, price, paf, location}){
    return(
        <article className="card-tournament" data-id={id}>
            <h2>{title}</h2>
            <p>{location}</p>
            <div className="info">
                <p>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <rect x="4" y="5" width="16" height="16" rx="1"/>
                        <path d="M8 2v6M16 2v6M4 11h16"/>
                    </svg>
                    {date}
                </p>
                <p>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <path d="M3 7h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4V7Z"/>
                        <path d="M15 7v3m0 2v2m0 2v3"/>
                    </svg>
                    {paf}
                </p>
                <p>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <circle cx="12" cy="12" r="9"/>
                        <path d="M15 8h-4a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9m3-10v12"/>
                    </svg>
                    {price}
                </p>
            </div>
            <div className="bottom">
                <p>{format}</p>
                <button type="button">Réserver <span aria-hidden="true">→</span></button>
            </div>
        </article>
    )
}
