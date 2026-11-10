import { useEffect, useState } from 'react'
import { apiService } from '../../services/apiService'
import useController from '../../hook/useController'
import './Modal.scss'

export default function ReserveTournamentModal({ tournament, userId, onClose, onReserved }) {
    const {
        loading: decksLoading,
        errorMessage: decksError,
        loadFetch: loadDecks,
    } = useController()
    const {
        loading,
        errorMessage,
        loadFetch,
    } = useController()
    const [decks, setDecks] = useState([])
    const [selectedDeckId, setSelectedDeckId] = useState('')

    useEffect(() => {
        let active = true
        loadDecks(apiService.deck.profile, userId)
            .then((data) => {
                if (!active || !data) return
                const compatibleDecks = data.decks.filter(
                    (deck) => String(deck.fk_id_game) === String(tournament.fk_id_game)
                )
                setDecks(compatibleDecks)
                if (compatibleDecks.length === 1)
                    setSelectedDeckId(String(compatibleDecks[0].id_decklist))
            })
            .catch(() => {
                // useController expose le message d’erreur.
            })
        return () => { active = false }
    }, [loadDecks, tournament.fk_id_game, userId])

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && !loading) onClose()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [loading, onClose])

    async function handleSubmit(event) {
        event.preventDefault()
        const result = await loadFetch(apiService.tournament.addPlayer, {
            tournamentId: tournament.id_tournament,
            idDeck: Number(selectedDeckId),
        })
        if (!result) return
        onReserved()
        onClose()
    }

    const hasNoCompatibleDecks = !decksLoading && !decksError && decks.length === 0

    return (
        <div
            className="modal-deck__backdrop"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !loading) onClose()
            }}
        >
            <section
                className="modal-deck"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-reserve-title"
            >
                <div className="modal-deck__heading">
                    <div>
                        <p className="modal-deck__eyebrow">Inscription au tournoi</p>
                        <h2 id="modal-reserve-title">{tournament.name_tournament}</h2>
                    </div>
                    <button
                        className="modal-deck__close"
                        type="button"
                        aria-label="Fermer"
                        onClick={onClose}
                        disabled={loading}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <label>
                        Decklist à utiliser
                        <span className="modal-deck__select-wrap">
                            <select
                                value={selectedDeckId}
                                onChange={(event) => setSelectedDeckId(event.target.value)}
                                disabled={decksLoading || hasNoCompatibleDecks || loading}
                                required
                            >
                                <option value="" disabled>
                                    {decksLoading ? 'Chargement de tes decklists…' : 'Choisis une decklist'}
                                </option>
                                {decks.map((deck) => (
                                    <option key={deck.id_decklist} value={deck.id_decklist}>
                                        {deck.name_decklist} — {deck.format_decklist}
                                    </option>
                                ))}
                            </select>
                            <span className="modal-deck__select-arrow" aria-hidden="true" />
                        </span>
                    </label>

                    {hasNoCompatibleDecks && (
                        <p className="modal-deck__hint">
                            Tu n’as pas de decklist pour le jeu de ce tournoi. Ajoute-en une depuis ton profil avant de t’inscrire.
                        </p>
                    )}
                    {decksError && <p className="modal-deck__error" role="alert">{decksError}</p>}
                    {errorMessage && <p className="modal-deck__error" role="alert">{errorMessage}</p>}

                    <div className="modal-deck__actions">
                        <button type="button" className="modal-deck__cancel" onClick={onClose} disabled={loading}>
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="modal-deck__submit"
                            disabled={loading || decksLoading || hasNoCompatibleDecks}
                        >
                            {loading ? 'Inscription en cours…' : 'Confirmer l’inscription'}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    )
}
