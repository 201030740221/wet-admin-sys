'use strict';

export default class Container extends React.Component {
  render() {
    return (
      <section className="main-container">
        {this.props.children}
      </section>
    );
  }
}
