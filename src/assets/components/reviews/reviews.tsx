import "./review.css";
const Reviews = () => {
  return (
    <div className="profiles-container">
      <figure className="comentariu">
        <img
          src="src/assets/images/1f8ab66a7a7b6c5dd740ce588ccee484.jpg"
          alt="profile-sample3"
          className="profile"
        />
        <figcaption>
          <h2>Ivan Radu</h2>
          <h4>Customer</h4>
          <blockquote>
            I have been a member of chess.com for 8 years, and in that time have
            also tried other online chess websites but did not find them to be
            as comprehensive or well-managed as this one.
          </blockquote>
        </figcaption>
      </figure>
      <figure className="comentariu">
        <img
          src="src/assets/images/download.jpg"
          alt="profile-sample5"
          draggable="false"
          className="profile"
        />
        <figcaption>
          <h2>Ivan Florea</h2>
          <h4>Customer</h4>
          <blockquote>
            It’s an amazing platform for complete noobs in chess and for those
            who aim to become professionals. Because it’s one of the biggest if
            not the biggest online chess platform.{" "}
          </blockquote>
        </figcaption>
      </figure>
      <figure className="comentariu">
        <img
          src="src/assets/images/images.jpg"
          alt="profile-sample6"
          draggable="false"
          className="profile"
        />
        <figcaption>
          <h2>Horga Rares</h2>
          <h4>Customer</h4>
          <blockquote>
            When I started playing chess I was very bad. Then one summer morning
            I decided to create an account on CHESS I would play people then, if
            they played an opening that I liked I would learn it (by using CHESS
            's databases) and improve.
          </blockquote>
        </figcaption>
      </figure>
    </div>
  );
};

export default Reviews;
