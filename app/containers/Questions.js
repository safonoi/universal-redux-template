import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Helmet from 'react-helmet';

import { loadQuestions } from '../actions/questions';
import Questions from '../components/Questions';

class QuestionContainer extends Component {
  static fetchData({ store }) {
    return store.dispatch(loadQuestions());
  }

  componentDidMount() {
    this.props.loadQuestions();
  }

  render() {
    return (
      <div>
        <Helmet
          title="Questions"
        />
        <h2>Question</h2>
        <Questions questions={this.props.questions}/>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { questions: state.questions };
}

export { QuestionContainer };
export default connect(mapStateToProps, { loadQuestions })(QuestionContainer);
