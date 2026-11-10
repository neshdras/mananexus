import './DeckCard.scss'

export default function DeckCard({ decks = [], isOwnProfile, onAddDeck }) {
    const decksByGame = decks.reduce((groups, deck) => {
        const gameId = deck.fk_id_game
        groups[gameId] ??= []
        groups[gameId].push(deck)
        return groups
    }, {})

    const gameIds = Object.keys(decksByGame).sort((a, b) =>
        (decksByGame[a][0].name_game ?? `Jeu ${a}`).localeCompare(
            decksByGame[b][0].name_game ?? `Jeu ${b}`,
            'fr'
        )
    )

    return (
        <section className="profile-decks" aria-labelledby="profile-decks-title">
            <div className="profile-decks__heading">
                <div>
                    <p className="profile-decks__eyebrow">Decklists</p>
                    <h2 id="profile-decks-title" className="profile-decks__title">
                        {isOwnProfile ? 'Mes decks' : 'Ses decks'}
                    </h2>
                </div>
                <span className="profile-decks__count">{decks.length}</span>
            </div>

            {isOwnProfile && (
                <button type="button" className="profile-decks__add-card" onClick={onAddDeck}>
                    <span className="profile-decks__plus" aria-hidden="true">+</span>
                    <span>Ajouter une decklist</span>
                </button>
            )}

            {decks.length === 0 ? (
                !isOwnProfile && (
                    <p className="profile-decks__empty">
                        Ce joueur n’a pas encore ajouté de decklist.
                    </p>
                )
            ) : (
                <div className="profile-decks__games">
                    {gameIds.map((gameId) => (
                        <section className="profile-decks__game" key={gameId}>
                            <h3 className="profile-decks__game-title">{decksByGame[gameId][0].name_game || `Jeu ${gameId}`}</h3>
                            <ul className="profile-decks__list">
                                {decksByGame[gameId].map((deck) => (
                                    <li className="profile-decks__item" key={deck.id_decklist}>
                                        <div>
                                            <h4 className="profile-decks__name">{deck.name_decklist}</h4>
                                            <p className="profile-decks__format">{deck.format_decklist}</p>
                                        </div>
                                        <a
                                            className="profile-decks__link"
                                            href={deck.url_decklist}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Voir la decklist
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            )}
        </section>
    )
}
