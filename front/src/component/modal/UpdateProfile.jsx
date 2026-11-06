import { useEffect, useState } from 'react'
import useAuth from '../../hook/useAuth'
import useController from '../../hook/useController'
import { apiService } from '../../services/apiService'
import './Modal.scss'

export default function UpdateProfile({ onClose, onProfileUpdated }) {
    const { user, setUser } = useAuth()
    const { loading, errorMessage, loadFetch } = useController()
    const [form, setForm] = useState(() => ({
        firstname: user?.firstname_user ?? '',
        lastname: user?.lastname_user ?? '',
        pseudo: user?.pseudo_user ?? '',
        email: user?.email_user ?? '',
        password: '',
    }))

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
        const payload = {
            firstname: form.firstname,
            lastname: form.lastname,
            pseudo: form.pseudo,
            email: form.email,
        }
        if (form.password) payload.password = form.password

        try {
            const result = await loadFetch(apiService.user.update, payload)
            if (!result) return
            const updatedUser = {
                ...user,
                firstname_user: payload.firstname.trim(),
                lastname_user: payload.lastname.trim(),
                pseudo_user: payload.pseudo.trim(),
                email_user: payload.email.trim().toLowerCase(),
            }
            setUser(updatedUser)
            onProfileUpdated?.(updatedUser)
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
                aria-labelledby="modal-update-profile-title"
            >
                <div className="modal-deck__heading">
                    <div>
                        <p className="modal-deck__eyebrow">Mon compte</p>
                        <h2 id="modal-update-profile-title">Modifier le profil</h2>
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
                        Prénom
                        <input
                            name="firstname"
                            type="text"
                            minLength="2"
                            maxLength="50"
                            value={form.firstname}
                            onChange={updateField}
                            required
                        />
                    </label>
                    <label>
                        Nom
                        <input
                            name="lastname"
                            type="text"
                            minLength="2"
                            maxLength="50"
                            value={form.lastname}
                            onChange={updateField}
                            required
                        />
                    </label>
                    <label>
                        Pseudo
                        <input
                            name="pseudo"
                            type="text"
                            minLength="3"
                            maxLength="50"
                            value={form.pseudo}
                            onChange={updateField}
                            required
                        />
                    </label>
                    <label>
                        Adresse e-mail
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={updateField}
                            required
                        />
                    </label>
                    <label>
                        Nouveau mot de passe <span>(facultatif)</span>
                        <input
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            minLength="6"
                            value={form.password}
                            onChange={updateField}
                        />
                    </label>
                    <p className="modal-deck__hint">
                        Si tu le modifies, il doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial.
                    </p>

                    {errorMessage && <p className="modal-deck__error" role="alert">{errorMessage}</p>}

                    <div className="modal-deck__actions">
                        <button type="button" className="modal-deck__cancel" onClick={onClose} disabled={loading}>
                            Annuler
                        </button>
                        <button type="submit" className="modal-deck__submit" disabled={loading}>
                            {loading ? 'Enregistrement…' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    )
}
