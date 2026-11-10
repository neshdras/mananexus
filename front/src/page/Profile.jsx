import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiService } from '../services/apiService'
import useAuth from '../hook/useAuth'
import useController from '../hook/useController'
import { NavBar } from '../component/navBar/NavBar'
import { Footer } from '../component/footer/Footer'
import { LogoLoader } from '../component/logoLoader/LogoLoader'
import InfoCard from '../component/infoCard/InfoCard'
import DeckCard from '../component/deckCard/DeckCard'
import ModalDeck from '../component/modal/ModalDeck'
import UpdateProfile from '../component/modal/UpdateProfile'
import '../styles/page/Profile.scss'

export function Profile() {
    const { id } = useParams()
    const { user: connectedUser } = useAuth()
    const { loading, errorMessage, loadFetch } = useController()
    const {
        loading: decksLoading,
        errorMessage: decksError,
        loadFetch: loadDecks,
    } = useController()
    const [loadedProfile, setLoadedProfile] = useState(null)
    const [attempt, setAttempt] = useState(0)
    const [isDeckModalOpen, setDeckModalOpen] = useState(false)
    const [isProfileModalOpen, setProfileModalOpen] = useState(false)

    const profileId = id ?? connectedUser?.id_user
    const isOwnProfile = Boolean(
        connectedUser && String(profileId) === String(connectedUser.id_user)
    )
    useEffect(()=>{
        document.title = 'Nexus Shuffle | Profil'
    }, [])
    useEffect(() => {
        if (!profileId) return

        let active = true

        const getProfileData = async (userId, signal) => {
            const profileData = isOwnProfile
                ? { user: connectedUser }
                : await apiService.user.profile(userId, signal)

            if (!profileData.user)
                throw new Error('Profil introuvable')

            return { user: profileData.user, decks: [], decksLoaded: false }
        }

        loadFetch(getProfileData, profileId)
            .then((data) => {
                if (!active) return
                setLoadedProfile({ id: String(profileId), ...data })
            })
            .catch(() => {
                // useController expose l’erreur et l’état de chargement.
            })

        return () => { active = false }
    }, [profileId, isOwnProfile, connectedUser, loadFetch, attempt])

    const hasLoadedProfile = loadedProfile?.id === String(profileId)
    const profile = isOwnProfile
        ? connectedUser
        : hasLoadedProfile ? loadedProfile.user : null
    const decks = hasLoadedProfile ? loadedProfile.decks : []

    const handleLoadDecks = () => {
        if (!profileId || !hasLoadedProfile || loadedProfile.decksLoaded || decksLoading)
            return

        loadDecks(apiService.deck.profile, profileId).then((data) => {
            if (!data) return
            setLoadedProfile((current) => current && current.id === String(profileId)
                ? { ...current, decks: data.decks, decksLoaded: true }
                : current)
        })
    }

    return (
        <div className="profile-page">
            <NavBar />
            <main className="profile-page__content">
                {loading && <LogoLoader />}
                {errorMessage && (
                    <div className="profile-page__error">
                        <p className="profile-page__error-message" role="alert">{errorMessage}</p>
                        <button className="profile-page__retry" type="button" onClick={() => setAttempt((value) => value + 1)}>
                            Réessayer
                        </button>
                    </div>
                )}

                {!loading && !errorMessage && profile && (
                    <>
                        <InfoCard
                            user={profile}
                            isOwnProfile={isOwnProfile}
                            onEdit={() => setProfileModalOpen(true)}
                        />
                        <DeckCard
                            decks={decks}
                            isOwnProfile={isOwnProfile}
                            onAddDeck={() => setDeckModalOpen(true)}
                            onVisible={handleLoadDecks}
                            onRetry={handleLoadDecks}
                            loading={decksLoading}
                            errorMessage={decksError}
                        />
                    </>
                )}
            </main>
            {isDeckModalOpen && isOwnProfile && (
                <ModalDeck
                    onClose={() => setDeckModalOpen(false)}
                    onDeckAdded={(deck) => {
                        setLoadedProfile((current) => current && current.id === String(profileId)
                            ? { ...current, decks: [...current.decks, deck] }
                            : current)
                    }}
                />
            )}
            {isProfileModalOpen && isOwnProfile && (
                <UpdateProfile onClose={() => setProfileModalOpen(false)} />
            )}
            <Footer />
        </div>
    )
}
