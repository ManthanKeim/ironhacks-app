import React from 'react'
import { Row, Col } from '../../../components/layout'
import upcomingImg from './images/upcoming-covid19-cta.png'


class UpcomingSection extends React.Component {
  render() {
    return (
        <Row>
          <h2 className="h2 text-center mb-4">
            UPCOMING <span className="font-extrabold">IRONHACKS</span>
          </h2>
          <Col colClass="text-center">
            <img src={upcomingImg} alt="Upcoming Hack" className="banner_img"/>
          </Col>
        </Row>
    )
  }
}

export { UpcomingSection }
