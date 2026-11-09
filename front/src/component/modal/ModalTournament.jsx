import { useEffect, useState } from 'react'
import { apiService } from '../../services/apiService'
import useController from '../../hook/useController'
import './Modal.scss'

const getLocalDateTime = () => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
}

const toLocalDateTime = (value) => {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    return date.toISOString().slice(0, 16)
}

export default function ModalTournament({ onClose, onTournamentCreated, onTournamentUpdated, tournament }) {
    const { loading, errorMessage, loadFetch } = useController()
    const isEditing = Boolean(tournament)
    const [form, setForm] = useState(() => tournament ? {
        name: tournament.name_tournament ?? '',
        format: tournament.format_tournament ?? '',
        date: toLocalDateTime(tournament.date_tournament),
        price: tournament.price_tournament ?? '',
        paf: tournament.ctc_tournament == null ? '' : String(tournament.ctc_tournament),
        location: tournament.location_tournament ?? '',
    } : {
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
            const request = isEditing
                ? apiService.tournament.update
                : apiService.tournament.create
            const result = await loadFetch(request, {
                ...form,
                date: new Date(form.date).toISOString(),
                paf: Number(form.paf),
                ...(isEditing && { id: tournament.id_tournament }),
            })
            if (!result) return
            if (isEditing) onTournamentUpdated()
            else onTournamentCreated()
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
                        <p className="modal-deck__eyebrow">{isEditing ? 'Modifier l’événement' : 'Nouvel événement'}</p>
                        <h2 id="modal-tournament-title">{isEditing ? 'Modifier le tournoi' : 'Créer un tournoi'}</h2>
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
                            {loading
                                ? (isEditing ? 'Modification en cours…' : 'Création en cours…')
                                : (isEditing ? 'Enregistrer les modifications' : 'Créer le tournoi')}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    )
}
