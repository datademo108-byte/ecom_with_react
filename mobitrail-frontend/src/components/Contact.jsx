import { Container, Form, Button } from "react-bootstrap";

const Contact = () => {
  return (
    <section className="bg-light py-5">
      <Container>
        <h2 className="text-center mb-4">Contact Us</h2>

        <Form className="w-50 mx-auto">
          <Form.Control className="mb-3" placeholder="Your Name" />
          <Form.Control className="mb-3" placeholder="Your Email" />
          <Form.Control
            as="textarea"
            rows={4}
            className="mb-3"
            placeholder="Message"
          />
          <Button variant="primary" className="w-100">
            Send Message
          </Button>
        </Form>
      </Container>
    </section>
  );
};

export default Contact;
