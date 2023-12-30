export const RatingStars = ({ value }) => {
    if (value === 0) {
      return (
        <div className="rating-stars">
          <span className="star-icon" style={{ color: "gray", fontSize: "1.2rem" }}>☆</span>
          <span className="star-icon" style={{ color: "gray", fontSize: "1.2rem" }}>☆</span>
          <span className="star-icon" style={{ color: "gray", fontSize: "1.2rem" }}>☆</span>
          <span className="star-icon" style={{ color: "gray", fontSize: "1.2rem" }}>☆</span>
          <span className="star-icon" style={{ color: "gray", fontSize: "1.2rem" }}>☆</span>
        </div>
      );
    }
    const fullStars = Math.floor(value);
    const halfStar = value - fullStars >= 0.5;
  
    const stars = [];
  
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star-icon" style={{color: "orange", fontSize: "1.2rem"}}>★</span>);
    }
  
    if (halfStar) {
      stars.push(<span key={fullStars} className="star-icon">½★</span>);
    }
  
    return <div className="rating-stars">{stars}</div>;
  };
  