import React from "react";

const Card = ({ card }) => {
    const imageUrl =
        card.image_uris?.normal ||
        card.card_faces?.[0]?.image_uris?.normal ||
        null;

    const manaCost = card.mana_cost || "";

    return (
        <div className="magic-card h-100 p-2 rounded-4 d-flex flex-column align-items-center text-center">
            {imageUrl ? (
                <img src={imageUrl} alt={card.name} loading="lazy" />
            ) : (
                <div className="card-placeholder">{card.name}</div>
            )}
            <h3>{card.name}</h3>
            <p className="type-line">{card.type_line}</p>
        </div>
    );
};

export default Card;
