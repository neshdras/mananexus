import { apiService } from "../services/apiService"
import { useEffect, useState } from "react"
import { TournamentCard } from "../component/tournamentCard/TournamentCard"
import useController from "../hook/useController"
import '../styles/page/Tournament.scss'
import {NavBar} from '../component/navBar/NavBar'
import {Footer} from '../component/footer/Footer'
import ModalTournament from '../component/modal/ModalTournament'
import ReserveTournamentModal from '../component/modal/ReserveTournamentModal'
import useAuth from '../hook/useAuth'
import { LogoLoader } from "../component/logoLoader/LogoLoader"
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
    const { user } = useAuth()
    const [tournaments, setTournaments] = useState(null)
    const [games, setGames] = useState([])
    const [selectedGameIds, setSelectedGameIds] = useState([])
    const [gamesLoading, setGamesLoading] = useState(true)
    const [gamesError, setGamesError] = useState('')
    const [attempt, setAttempt] = useState(0)
    const [isCreateModalOpen, setCreateModalOpen] = useState(false)
    const [tournamentToEdit, setTournamentToEdit] = useState(null)
    const [tournamentToReserve, setTournamentToReserve] = useState(null)
    const [reservedTournamentIds, setReservedTournamentIds] = useState([])

    useEffect(()=>{
        document.title = 'Nexus Shuffle | Profil'
    }, [])

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

    useEffect(() => {
        let active = true
        apiService.game.seeAll()
            .then((data) => {
                if (active) setGames(data.games)
            })
            .catch((error) => {
                if (active) setGamesError(error.message || 'Impossible de charger les jeux.')
            })
            .finally(() => {
                if (active) setGamesLoading(false)
            })

        return () => { active = false }
    }, [])

    function retry() {
        setAttempt((value) => value + 1)
    }

    function updateGameFilter(gameId, isChecked) {
        const normalizedGameId = String(gameId)

        setSelectedGameIds((current) => {
            if (isChecked)
                return current.includes(normalizedGameId) ? current : [...current, normalizedGameId]

            return current.filter((id) => id !== normalizedGameId)
        })
    }

    const visibleTournaments = (tournaments ?? []).filter((tournament) => (
        selectedGameIds.length === 0
        || selectedGameIds.includes(String(tournament.fk_id_game))
    ))

    return(
        <>
        <NavBar/>
        <main className="tournament-page">
            <div className="tournament-page__heading">
                <h1 className="tournament-page__title">Tournois disponibles</h1>
                <button className="tournament-page__create" type="button" onClick={() => setCreateModalOpen(true)}>
                    <span className="tournament-page__create-icon" aria-hidden="true">+</span> Ajouter un tournoi
                </button>
            </div>
            <fieldset className="tournament-page__filters">
                <legend className="tournament-page__filters-title">Filtrer par jeu</legend>
                {gamesLoading && <p className="tournament-page__filters-status">Chargement des jeux…</p>}
                {gamesError && <p className="tournament-page__filters-error" role="alert">{gamesError}</p>}
                {!gamesLoading && !gamesError && (
                    <>
                        <div className="tournament-page__filter-options">
                            {games.map((game) => {
                                const gameId = String(game.id_game)
                                return (
                                    <label className="tournament-page__filter-option" key={gameId}>
                                        <input
                                            className="tournament-page__filter-checkbox"
                                            type="checkbox"
                                            checked={selectedGameIds.includes(gameId)}
                                            onChange={(event) => updateGameFilter(gameId, event.target.checked)}
                                        />
                                        <span>{game.name_game}</span>
                                    </label>
                                )
                            })}
                        </div>
                        <button
                            className="tournament-page__filter-reset"
                            type="button"
                            onClick={() => setSelectedGameIds([])}
                            disabled={selectedGameIds.length === 0}
                        >
                            Tous les jeux
                        </button>
                    </>
                )}
            </fieldset>
            {loading && <LogoLoader/>}
            {errorMessage && (
                <div className="tournament-page__error">
                    <p className="tournament-page__error-message" role="alert">{errorMessage}</p>
                    <button className="tournament-page__retry" type="button" onClick={retry}>Réessayer</button>
                </div>
            )}
            {!loading && !errorMessage && tournaments?.length === 0 && (
                <p className="tournament-page__empty">Aucun tournoi à venir pour le moment.</p>
            )}
            {!loading && !errorMessage && (tournaments?.length ?? 0) > 0 && visibleTournaments.length === 0 && (
                <p className="tournament-page__empty">Aucun tournoi pour les jeux sélectionnés.</p>
            )}
            <div className="tournament-page__list">
                {visibleTournaments.map((tournament) => (
                    <TournamentCard
                        key={tournament.id_tournament}
                        id={tournament.id_tournament}
                        gameId={tournament.fk_id_game}
                        title={tournament.name_tournament}
                        format={tournament.format_tournament}
                        date={formatDate(tournament.date_tournament)}
                        price={tournament.price_tournament ?? 'Lots à confirmer'}
                        paf={tournament.ctc_tournament == null
                            ? 'Participation à confirmer'
                            : moneyFormatter.format(tournament.ctc_tournament)}
                        location={tournament.location_tournament}
                        canEdit={Boolean(user && String(user.id_user) === String(tournament.fk_id_user))}
                        isReserved={reservedTournamentIds.includes(String(tournament.id_tournament))}
                        onReserve={() => setTournamentToReserve(tournament)}
                        onEdit={() => setTournamentToEdit(tournament)}
                    />
                ))}
            </div>
        </main>
        {isCreateModalOpen && (
            <ModalTournament
                onClose={() => setCreateModalOpen(false)}
                onTournamentCreated={() => setAttempt((value) => value + 1)}
            />
        )}
        {tournamentToEdit && (
            <ModalTournament
                tournament={tournamentToEdit}
                onClose={() => setTournamentToEdit(null)}
                onTournamentUpdated={() => setAttempt((value) => value + 1)}
            />
        )}
        {tournamentToReserve && user && (
            <ReserveTournamentModal
                tournament={tournamentToReserve}
                userId={user.id_user}
                onClose={() => setTournamentToReserve(null)}
                onReserved={() => setReservedTournamentIds((current) => (
                    current.includes(String(tournamentToReserve.id_tournament))
                        ? current
                        : [...current, String(tournamentToReserve.id_tournament)]
                ))}
            />
        )}
        <Footer/>
        </>
    )
}
