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

    function retry() {
        setAttempt((value) => value + 1)
    }

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
            <div className="tournament-page__list">
                {tournaments?.map((tournament) => (
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
