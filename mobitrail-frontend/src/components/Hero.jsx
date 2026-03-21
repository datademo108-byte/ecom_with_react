import { Container, Button } from "react-bootstrap";

const Hero = () => {
  return (
    <section className="bg-light py-5">
      <Container className="text-center">
        <h1 className="fw-bold">
          Building Digital Solutions for Modern Businesses
        </h1>
        <p className="text-muted mt-3">
          We create scalable mobile and web applications that help businesses
          grow faster.
        </p>
        <Button className=" btn-info btn-outline-dark" >
          Get Started
        </Button>
      </Container>
    </section>
  );
};

export default Hero;
