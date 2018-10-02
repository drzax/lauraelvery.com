import React from "react";

export default class HomePreview extends React.Component {
  render() {
    const {entry} = this.props;

    return (
      <div className="book">
        <img
          className="cover"
          sizes="(min-width: 40em) 80vw, 100vw"
          srcset={`/images/${entry.getIn(["Params", "book", "image"])}-small.jpg 480w,/images/${entry.getIn(["Params", "book", "image"])}-medium.jpg 675w`}
          src={`/images/${entry.getIn(["Params", "book", "image"])}-small.jpg`}
          alt="Cover of 'Trick of the Light' by Laura Elvery"
        />

        <a class="buy" href={entry.getIn(["Params", "book", "buy"])} title="Buy Trick of the Light by Laura Elvery">
          Buy now →
        </a>
        {entry.getIn(["Params", "book", "praise"]).map((praise) => {
          <div class="endorsements">
            <blockquote>
              <p>{praise.getIn(["quote"])}</p>
            </blockquote>
          </div>;
        })}
      </div>
    );
  }
}
