import { Container, Row, Col } from "react-bootstrap";

const WhyChooseUs = () => {
  return (
    <section className="py-5">
      <Container>
        <h2 className="text-center mb-4">Why Choose Us</h2>

        <Row className="text-center">
          <Col md={3}>✔ Experienced Team</Col>
          <Col md={3}>✔ Quality Assurance</Col>
          <Col md={3}>✔ On-Time Delivery</Col>
          <Col md={3}>✔ 24/7 Support</Col>
        </Row>
      </Container>
    </section>
  );
};

export default WhyChooseUs;
