import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

function About(props) {
  return (
    <section className="py-5 bg-light">
      <Container>
        {/* Heading */}
        <Row className="mb-4 text-center">
          <Col>
            <h2 className="fw-bold">About Us</h2>
            <p className="text-muted">
              We are a technology-driven company delivering high-quality digital
              solutions for businesses worldwide.{props.prop}
              <br />
              {props.data}
            </p>
          </Col>
        </Row>

        {/* Content */}
        <Row className="align-items-center">
          {/* Left Text */}
          <Col md={6} className="mb-4">
            <h4 className="fw-semibold">Who We Are</h4>
            <p>
              We specialize in building scalable web applications, mobile apps,
              and cloud-based solutions using modern technologies. Our goal is
              to help startups and enterprises grow through innovative digital
              products.
            </p>

            <p>
              With a team of experienced developers and designers, we focus on
              performance, security, and user experience.
            </p>
          </Col>

          {/* Right Cards */}
          <Col md={6}>
            <Row>
              <Col sm={6} className="mb-3">
                <Card className="h-100 shadow-sm text-center">
                  <Card.Body>
                    <h3 className="text-primary">5+</h3>
                    <p className="mb-0">Years Experience</p>
                  </Card.Body>
                </Card>
              </Col>

              <Col sm={6} className="mb-3">
                <Card className="h-100 shadow-sm text-center">
                  <Card.Body>
                    <h3 className="text-primary">100+</h3>
                    <p className="mb-0">Projects Delivered</p>
                  </Card.Body>
                </Card>
              </Col>

              <Col sm={6} className="mb-3">
                <Card className="h-100 shadow-sm text-center">
                  <Card.Body>
                    <h3 className="text-primary">50+</h3>
                    <p className="mb-0">Happy Clients</p>
                  </Card.Body>
                </Card>
              </Col>

              <Col sm={6} className="mb-3">
                <Card className="h-100 shadow-sm text-center">
                  <Card.Body>
                    <h3 className="text-primary">24/7</h3>
                    <p className="mb-0">Support</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default About;
