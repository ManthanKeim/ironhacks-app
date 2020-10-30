import { Component } from 'react';
import { OverlayLoaderContainer, Loader } from '../../components/loader';
import Separator from '../../util/separator';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Page, Section, Row, Col } from '../../components/layout';
import { HackNav, HackPageBreadCrumbs } from '../../components/hacks';
import { Hack } from '../hacks';
import ThreadView from '../forum/thread-view';
import ThreadEditView from '../forum/post-edit-view';
import NewThread from '../forum/new-thread';
import { CountdownTimer } from '../../components/timer';

const HackNavSection = (
  {
    hackDisplayOptions,
    hackId,
    hackSlug,
  },
) => {
  return (
    <Row>
      <Col>
        <HackNav
          hackDisplayOptions={hackDisplayOptions}
          hackId={hackId}
          hackSlug={hackSlug}
        />
      </Col>
      <Separator primary />
    </Row>
  );
};


class HackPage extends Component {
  constructor(props) {
    super(props);

    this.hackSlug = this.props.match.params.hackSlug;

    this.state = {
      hackId: null,
      status: 'loading',
      activeView: 'task',
      loading: true,
      hackPhases: [],
      hackTask: null,
    };

    this.getHack(this.hackSlug);
  }

  getHack = async hackSlug => {
    let hacks = await window.firebase.firestore()
      .collection('hacks')
      .where('hackSlug', '==', hackSlug)
      .get();

    if (hacks.docs[0].exists) {
      let hackData = hacks.docs[0].data();
      this.state.hackId = hacks.docs[0].id;

      let upcomingEvent = this.getUpcomingHackEvent(hackData)

      this.setState({
        hackId: hacks.docs[0].id,
        hackData: hackData,
        hackName: hackData.name,
        hackDisplayOptions: hackData.displayOptions,
        hackExtensions: hackData.extensions ? hackData.extensions : false,
        hackPhases: hackData.phases,
        hackRules:  hackData.rules ? hackData.rules.doc : '',
        hackResults: hackData.results,
        hackBanner: hackData.hackBannerImg ? hackData.hackBannerImg : false,
        hackRegistration: hackData.registrationSurvey ? hackData.registrationSurvey : '',
        hackOverview: hackData.overview ? hackData.overview.doc : '',
        hackTask: hackData.task,
        hackTutorial: hackData.tutorial ? hackData.tutorial.doc : '',
        upcomingEvent: upcomingEvent,
      })
    }
  };

  getUpcomingHackEvent(hackData) {
    let startDate = hackData.startDate;
    if (startDate && Date.parse(startDate) > Date.now()) {
      return {
        date: startDate,
        name: 'Opening Date',
      }
    } else {
      return false;
    }
  }

  render() {
    if (!this.state.hackId) {
      return  (
        <OverlayLoaderContainer>
          <Loader status={this.state.status} />
        </OverlayLoaderContainer>
      )
    } else {

    }
      return (
       <Page
          pageTitle={`IronHacks | ${this.state.hackName} Hack Page`}
          pageDescription="IronHacks Hack Event Page"
          pageUrl={`https://ironhacks.com/hacks/${this.hackSlug}`}
          user={this.props.user}
          userIsAdmin={this.props.userIsAdmin}
          >

        <HackPageBreadCrumbs
          hackSlug={this.hackSlug}
          hackName={this.state.hackName}
        />

        {this.state.upcomingEvent && (
          <div className="event-countdown" style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
            <span>Upcoming: <strong>{this.state.upcomingEvent.name}</strong></span>

            <div style={{
              margin: '0 .5em',
            }}>
              <CountdownTimer
                endTime={this.state.upcomingEvent.date}
              />
            </div>
          </div>
        )}

          <Switch>
            <Route exact path="/hacks/:hackId/register">
              <Section sectionClass="py-3">
                <Hack.Registration
                  userEmail={this.props.user.email}
                  userId={this.props.userId}
                  hackSlug={this.hackSlug}
                  hackId={this.state.hackId}
                  hackName={this.state.hackName}
                  hackRegistration={this.state.hackRegistration}
                />
              </Section>
            </Route>

            <Route exact path="/hacks/:hackId">
              {this.state.hackBanner && (
                <Section sectionClass="py-3">
                  <Row>
                    <img src={this.state.hackBanner} alt='Hack Banner Img'/>
                  </Row>
                </Section>
              )}

              {this.state.hackDisplayOptions && (
              <Section>
                <HackNavSection
                  hackSlug={this.hackSlug}
                  hackId ={this.state.hackId}
                  hackDisplayOptions={this.state.hackDisplayOptions}
                  hackName={this.state.hackName}
                />
              </Section>
              )}
            </Route>

            <Route path="/hacks/:hackId/*">
              <Section>
                <HackNavSection
                  hackId ={this.state.hackId}
                  hackSlug={this.hackSlug}
                  hackDisplayOptions={this.state.hackDisplayOptions}
                  hackName={this.state.hackName}
                />
              </Section>
            </Route>
          </Switch>

          <Switch>
            <Route exact path="/hacks/:hackId">
              <Section>
                <Hack.Overview
                  hackId={this.state.hackId}
                  userId={this.props.userId}
                  document={this.state.hackOverview}
                />
              </Section>
            </Route>

            <Route exact path="/hacks/:hackId/calendar">
              <Section>
                <Hack.Calendar
                  data={this.state.hackExtensions}
                  hackId={this.state.hackId}
                />
              </Section>
            </Route>

            <Route exact path="/hacks/:hackSlug/forum">
              <Section>
                <Hack.Forum
                  userIsAdmin={this.props.userIsAdmin}
                  hackId={this.state.hackId}
                  userId={this.props.userId}
                  user={this.props.user}
                />
              </Section>
            </Route>

            <Route exact path="/hacks/:hackId/forum/:forumId/:threadId/edit">
              <Section>
                <ThreadEditView
                  userIsAdmin={this.props.userIsAdmin}
                  hackId={this.state.hackId}
                  userId={this.props.userId}
                  user={this.props.user}
                />
              </Section>
            </Route>

            <Route path="/hacks/:hackId/forum/:forumId/:threadId">
              <Section>
                <ThreadView
                  userIsAdmin={this.props.userIsAdmin}
                  hackId={this.state.hackId}
                  userId={this.props.userId}
                  user={this.props.user}
                />
              </Section>
            </Route>

            <Route exact path="/hacks/:hackId/forum/new">
              <Section>
                <NewThread
                  userIsAdmin={this.props.userIsAdmin}
                  hackId={this.state.hackId}
                  userId={this.props.userId}
                  user={this.props.user}
                />
              </Section>
            </Route>


            <Route exact path="/hacks/:hackId/quiz">
              <Section>
                <Hack.Quiz
                  hackId={this.state.hackId}
                  userId={this.props.userId}
                  user={this.props.user}
                />
              </Section>
            </Route>

            <Route exact path="/hacks/:hackId/results">
              <Section sectionClass="results-section">
                <Hack.Results
                  hackData={this.state.hackData}
                  user={this.props.user}
                  userId={this.props.userId}
                  hackId={this.state.hackId}
                />
              </Section>
            </Route>

            <Route exact path="/hacks/:hackId/rules">
              <Section sectionClass="rules-section">
                <Hack.Rules
                  hackId={this.state.hackId}
                  userId={this.props.userId}
                  content={this.state.hackRules}
                />
              </Section>
            </Route>

            <Route exact path="/hacks/:hackId/task">
              <Section>
                <Hack.Task
                  userEmail={this.props.user.email}
                  hackId={this.state.hackId}
                  userId={this.props.userId}
                  task={this.state.hackTask}
                />
                </Section>
              </Route>

            <Route exact path="/hacks/:hackId/tutorial">
              <Section>
                <Hack.Tutorial
                  hackid={this.state.hackId}
                  userId={this.props.userId}
                  hackTutorial={this.state.hackTutorial}
                />
              </Section>
            </Route>

            <Route exact path="/hacks/:hackId/submissions">
              <Section>
                <Hack.Submissions
                  hackSlug={this.hackSlug}
                  hackId={this.state.hackId}
                  userId={this.props.userId}
                  hackData={this.state.hackData}
                />
              </Section>
            </Route>

            <Route path="/hacks/:hackId/submit/:submissionId">
              <Section>
                <Hack.Submit
                  hackSlug={this.hackSlug}
                  hackId={this.state.hackId}
                  userId={this.props.userId}
                  hackData={this.state.hackData}
                />
              </Section>
            </Route>

            <Redirect push to={`/hacks/${this.hackSlug}`}/>

          </Switch>
      </Page>
      )
    }
}

export default withRouter(HackPage)
