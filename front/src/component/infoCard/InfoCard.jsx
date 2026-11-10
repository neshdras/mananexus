import './InforCard.scss'

export default function InfoCard({ user, isOwnProfile, onEdit }) {
    if (!user) return null

    const fullName = [user.firstname_user, user.lastname_user]
        .filter(Boolean)
        .join(' ')
    const initials = [user.firstname_user, user.lastname_user]
        .filter(Boolean)
        .map((name) => name[0])
        .join('')

    return (
        <section className="profile-info" aria-labelledby="profile-info-title">
            <div className="profile-info__avatar" aria-hidden="true">
                {user.picture_user
                ? <img className="profile-info__avatar-image" src={user.picture_user} alt="" />
                    : <span>{initials || user.pseudo_user?.[0] || '?'}</span>}
            </div>
            <div className="profile-info__details">
                <p className="profile-info__eyebrow">
                    {isOwnProfile ? 'Mon profil' : 'Profil joueur'}
                </p>
                <h1 id="profile-info-title" className="profile-info__title">
                    {user.pseudo_user || fullName || 'Joueur'}
                </h1>
                {fullName && <p className="profile-info__name">{fullName}</p>}
                {isOwnProfile && user.email_user && (
                    <p className="profile-info__email">{user.email_user}</p>
                )}
                {isOwnProfile && (
                    <button type="button" className="profile-info__edit" onClick={onEdit}>
                        Modifier mon profil
                    </button>
                )}
            </div>
        </section>
    )
}
