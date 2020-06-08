import React from 'react';
import { withCookies } from 'react-cookie';
import { HackNav } from './hack-nav';
import Separator from '../../util/separator';
import { Loader } from '../../components/loader';
import { withRouter } from 'react-router';
import { Section, Row, Col } from '../../components/layout';
import TutorialScreen from '../tutorial';
import ExamplesPage from '../examples';
import ForumView from '../forum/forum.js';
// import ThreadViewWithRouter from '../forum/threadView/threadView';
// import NewThread from '../forum/newThread.js';
import { ProjectEditor } from '../../components/project';
import { ProjectsPage } from  '../projects';
import TaskView from '../task';
import { ResultsView } from '../results';
import QuizListView from '../quiz/quiz-list-view';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link,
} from 'react-router-dom';

class HackPage extends React.Component {
  constructor(props) {
    super(props);

    this.hackId = this.props.match.params.hackId;

    const hackDataPromise = this.getHack(this.hackId);

    this.state = {
      hackUserId: null,
      hackId: this.hackId,
      activeView: 'task',
      user: this.props.user,
      loading: false,
      hackPhases: [],
      hackTask: null,
    };


    Promise.resolve(hackDataPromise).then((hackData) => {
       this.hackData = hackData;
       this.hackName = hackData.name;
       this.state.hackPhases = hackData.phases
       this.state.hackTutorial = hackData.tutorial.doc;
       this.state.hackData =  hackData;
    });
    this.updateHackView = this.updateHackView.bind(this);
  }

  componentDidMount() {
    this.setHackTask();
  }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  // }

  // componentWillUnmount() {
  // }

  async getHack(hackId) {
    let hack = await window.firebase.firestore()
      .collection('hacks')
      .doc(hackId)
      .get();

    if (hack.exists) {
      var hackData = hack.data();
      console.log('hackdata', hackData);
      return hackData;
    }

    return false;
  }

  setHack(hackData) {
    if (hackData) {
      this.setState({
        hackData: hackData,
        loading: false,
      });
    }
  }

  async getHackTask(hackId) {
    const getTask = window.firebase.functions().httpsCallable('getTaskDoc');
    let task = await getTask({
      hackId: hackId,
    })
    return task.data.task;
  }

  setHackTask() {
    const hackTaskPromise = this.getHackTask(this.hackId);
    Promise.resolve(hackTaskPromise).then((hackTask) => {
      if (hackTask.length > 0) {
        this.setState({
          hackTask: hackTask,
          loading: false,
        })
      }
    })
  }

  setCurrentHack(_hack_id) {
    // const { cookies } = this.props;
    // cookies.set('currentHack', _hack_id);
  };

  updateHackView(target) {
    console.log('update view', this, this.context, target);
    this.setState({
      activeView: target
    })

    console.log(this.props.history)
    this.props.history.push(`./${target}`)
    this.props.history.go(`./${target}`)

  }

  render() {
    if (this.state.loading) {
      return (
        <Section>
          <Loader status={this.state.status} />
        </Section>
    )
  } else {
      return (
        <>
        <Section>
          <Row>
            <Col>
              <h2 className="pt-3">
                <strong>Hack: </strong>
                <span>{ this.hackName } </span>
                <span className="small">({ this.hackId })</span>
              </h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <HackNav action={this.updateHackView}/>
              <Separator primary />
            </Col>
          </Row>
        </Section>

        <Router>
          <Switch>
            <Route exact path="/hacks/:hackId/task">
            <Section>
              <TaskView
                hackId={this.hackId}
                task={this.state.hackTask}
              />
              </Section>
            </Route>

            <Route exact path="/hacks/:hackId/forum">
              <Section>
                <ForumView
                  hackId={this.hackId}
                  user={this.props.user}
                />
              </Section>
            </Route>

            <Route exact path="/hacks/:hackId/tutorial">
              <Section>
                <TutorialScreen
                  hackid={this.hackId}
                  tutorial={this.state.hackTutorial}
                />
              </Section>
            </Route>

            <Route exact path="/hacks/:hackId/examples">
              <Section>
                <ExamplesPage
                  hackId={this.hackId}
                />
              </Section>
            </Route>

            <Route exact path="/hacks/:hackId/quiz">
              <Section>
                <QuizListView
                  hackId={this.hackId}
                  user={this.props.user}
                  isAdmin={this.state.userIsAdmin}
                />
              </Section>
            </Route>

            <Route exact path="/hacks/:hackId/projects">
              <Section>
                <ProjectsPage
                  hackId={this.hackId}
                  user={this.props.user}
                  userId={this.props.userId}
                  hackData={this.state.hackData}
                />
              </Section>
            </Route>

            <Route exact path="/hacks/:hackId/projects/:projectName">
              <Section
                sectionClass="section_full"
                containerClass="w-full max-w-none"
              >
                <ProjectEditor
                  hackId={this.hackId}
                  hackData={this.state.hackData}
                  user={this.props.user}
                  userId={this.props.userId}
                  userIsAdmin={this.state.userIsAdmin}
                />
              </Section>
            </Route>

            <Route exact path="/hacks/:hackId/results">
              <Section>
                <ResultsView
                  hackData={this.state.hackData}
                  hackPhases={this.state.hackPhases}
                  hackUser={this.props.user}
                  hackUserId={this.props.userId}
                  hackId={this.hackId}
                />
              </Section>
            </Route>
          </Switch>
        </Router>
      </>
      )
    }
  }
}

export default withCookies(withRouter(HackPage))
