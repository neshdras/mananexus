import { apiService } from "../services/apiService"
import { useEffect, useState } from "react"
import { TournamentCard } from "../component/tournamentCard/TournamentCard"
import useController from "../hook/useController"
import '../styles/page/Tournament.scss'

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
})
const moneyFormatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
})

function formatDate(value) {
    const date = value ? new Date(value) : null
    return date && !Number.isNaN(date.getTime())
        ? dateFormatter.format(date)
        : 'Date à confirmer'
}

export function Tournament(){
    const { loading, errorMessage, loadFetch } = useController()
    const [tournaments, setTournaments] = useState(null)
    const [attempt, setAttempt] = useState(0)

    useEffect(() => {
        let active = true
        loadFetch(apiService.tournament.seeAll)
            .then((data) => {
                if (active) setTournaments(data.tournaments)
            })
            .catch(() => {
                // Le hook useController gère déjà l'erreur et le chargement.
            })

        return () => { active = false }
    }, [attempt, loadFetch])

    function retry() {
        setAttempt((value) => value + 1)
    }

    return(
        <main className="tournament-page">
            <h1>Tournois disponibles</h1>
            {loading && <p role="status">Chargement des tournois…</p>}
            {errorMessage && (
                <div>
                    <p role="alert">{errorMessage}</p>
                    <button type="button" onClick={retry}>Réessayer</button>
                </div>
            )}
            {!loading && !errorMessage && tournaments?.length === 0 && (
                <p>Aucun tournoi à venir pour le moment.</p>
            )}
            <div className="tournament-list">
                {tournaments?.map((tournament) => (
                    <TournamentCard
                        key={tournament.id_tournament}
                        id={tournament.id_tournament}
                        title={tournament.name_tournament}
                        format={tournament.format_tournament}
                        date={formatDate(tournament.date_tournament)}
                        price={tournament.price_tournament ?? 'Lots à confirmer'}
                        paf={tournament.ctc_tournament == null
                            ? 'Participation à confirmer'
                            : moneyFormatter.format(tournament.ctc_tournament)}
                        location={tournament.location_tournament}
                    />
                ))}
            </div>
        </main>
    )
}
