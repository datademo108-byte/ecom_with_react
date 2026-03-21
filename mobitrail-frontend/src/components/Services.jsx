import { Container, Row, Col, Card } from "react-bootstrap";
import { services } from "../data/servicesData";

const Services = () => {
  return (
    <section className="py-5">
      <Container>
        <h2 className="text-center mb-4">Our Services</h2>

        <Row>
          {services.map((service, index) => (
            <Col md={3} key={index} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={service.image}
                  alt={service.title}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{service.title}</Card.Title>
                  <Card.Text>{service.desc}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Services;
