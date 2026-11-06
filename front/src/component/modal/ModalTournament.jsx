import { useEffect, useState } from 'react'
import { apiService } from '../../services/apiService'
import useController from '../../hook/useController'
import './Modal.scss'

const getLocalDateTime = () => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
}

export default function ModalTournament({ onClose, onTournamentCreated }) {
    const { loading, errorMessage, loadFetch } = useController()
    const [form, setForm] = useState({
        name: '',
        format: '',
        date: '',
        price: '',
        paf: '',
        location: '',
    })

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
            const tournament = await loadFetch(apiService.tournament.create, {
                ...form,
                date: new Date(form.date).toISOString(),
                paf: Number(form.paf),
            })
            if (!tournament) return
            onTournamentCreated()
            onClose()
        } catch {
            // useController expose le message d’erreur à afficher.
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
                aria-labelledby="modal-tournament-title"
            >
                <div className="modal-deck__heading">
                    <div>
                        <p className="modal-deck__eyebrow">Nouvel événement</p>
                        <h2 id="modal-tournament-title">Créer un tournoi</h2>
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
                        Nom du tournoi
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
                        Jeu et format
                        <input
                            name="format"
                            type="text"
                            minLength="2"
                            value={form.format}
                            onChange={updateField}
                            placeholder="Ex. Magic — Commander"
                            required
                        />
                    </label>
                    <label>
                        Date et heure
                        <input
                            name="date"
                            type="datetime-local"
                            min={getLocalDateTime()}
                            value={form.date}
                            onChange={updateField}
                            required
                        />
                    </label>
                    <label>
                        Lots / récompenses
                        <input
                            name="price"
                            type="text"
                            minLength="2"
                            value={form.price}
                            onChange={updateField}
                            placeholder="Ex. Deux boosters"
                            required
                        />
                    </label>
                    <label>
                        Participation (€)
                        <input
                            name="paf"
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={form.paf}
                            onChange={updateField}
                            required
                        />
                    </label>
                    <label>
                        Lieu
                        <input
                            name="location"
                            type="text"
                            minLength="2"
                            value={form.location}
                            onChange={updateField}
                            required
                        />
                    </label>

                    {errorMessage && <p className="modal-deck__error" role="alert">{errorMessage}</p>}

                    <div className="modal-deck__actions">
                        <button type="button" className="modal-deck__cancel" onClick={onClose} disabled={loading}>
                            Annuler
                        </button>
                        <button type="submit" className="modal-deck__submit" disabled={loading}>
                            {loading ? 'Création en cours…' : 'Créer le tournoi'}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    )
}
