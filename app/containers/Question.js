import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { browserHistory } from 'react-router';
import { loadQuestionDetail } from '../actions/questions';

class Question extends Component {
  static fetchData({ store, params: { id }, history }) {
    return store.dispatch(loadQuestionDetail({ id, history }));
  }

  static get propTypes() {
    return {
      question: PropTypes.object.isRequired
    };
  }

  componentDidMount() {
    const { id } = this.props.params;
    this.props.loadQuestionDetail({ id, history: browserHistory });
  }

  render() {
    const { question } = this.props;
    return (
      <div>
        <Helmet
          title={`Question ${this.props.params.id}`}
        />
        <h2>{question.get('content')}</h2>
        <h3> User: {question.getIn(['user', 'name'])} </h3>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { question: state.questionDetail };
}

export { Question };
export default connect(mapStateToProps, { loadQuestionDetail })(Question);
