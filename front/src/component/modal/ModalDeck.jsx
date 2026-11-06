import { useEffect, useState } from 'react'
import { apiService } from '../../services/apiService'
import useController from '../../hook/useController'
import './Modal.scss'

export default function ModalDeck({ onClose, onDeckAdded }) {
    const { loading, errorMessage, loadFetch } = useController()
    const {
        loading: gamesLoading,
        errorMessage: gamesError,
        loadFetch: loadGames,
    } = useController()
    const [form, setForm] = useState({ gameId: '', name: '', format: '', url: '' })
    const [games, setGames] = useState([])

    useEffect(() => {
        let active = true
        loadGames(apiService.game.seeAll)
            .then((data) => {
                if (active) setGames(data.games)
            })
            .catch(() => {
                // Le message d’erreur est exposé par useController.
            })
        return () => { active = false }
    }, [loadGames])

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && !loading) onClose()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [loading, onClose])

    function updateField(event) {
        const { name, value } = event.target
        setForm((current) => ({ ...current, [name]: value }))
    }

    async function handleSubmit(event) {
        event.preventDefault()
        try {
            const deck = await loadFetch(apiService.deck.create, {
                ...form,
                gameId: Number(form.gameId),
            })
            onDeckAdded(deck)
            onClose()
        } catch {
            // useController fournit le message d’erreur à afficher.
        }
    }

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
                aria-labelledby="modal-deck-title"
            >
                <div className="modal-deck__heading">
                    <div>
                        <p className="modal-deck__eyebrow">Nouvelle decklist</p>
                        <h2 id="modal-deck-title">Ajouter un deck</h2>
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
                        Jeu
                        <span className="modal-deck__select-wrap">
                            <select
                                name="gameId"
                                value={form.gameId}
                                onChange={updateField}
                                disabled={gamesLoading || games.length === 0}
                                required
                            >
                                <option value="" disabled>
                                    {gamesLoading ? 'Chargement des jeux…' : 'Choisis un jeu'}
                                </option>
                                {games.map((game) => (
                                    <option key={game.id_game} value={game.id_game}>
                                        {game.name_game}
                                    </option>
                                ))}
                            </select>
                            <span className="modal-deck__select-arrow" aria-hidden="true" />
                        </span>
                    </label>
                    <label>
                        Nom du deck
                        <input
                            name="name"
                            type="text"
                            minLength="2"
                            value={form.name}
                            onChange={updateField}
                            required
                        />
                    </label>
                    <label>
                        Format
                        <input
                            name="format"
                            type="text"
                            minLength="2"
                            value={form.format}
                            onChange={updateField}
                            placeholder="Ex. Commander"
                            required
                        />
                    </label>
                    <label>
                        Lien vers la decklist
                        <input
                            name="url"
                            type="url"
                            value={form.url}
                            onChange={updateField}
                            placeholder="https://moxfield.com/..."
                            required
                        />
                    </label>
                    <p className="modal-deck__hint">
                        Liens acceptés : Moxfield, Piltover Archive et Riftdecks.
                    </p>

                    {gamesError && <p className="modal-deck__error" role="alert">{gamesError}</p>}
                    {errorMessage && <p className="modal-deck__error" role="alert">{errorMessage}</p>}

                    <div className="modal-deck__actions">
                        <button type="button" className="modal-deck__cancel" onClick={onClose} disabled={loading}>
                            Annuler
                        </button>
                        <button type="submit" className="modal-deck__submit" disabled={loading}>
                            {loading ? 'Ajout en cours…' : 'Ajouter le deck'}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    )
}
