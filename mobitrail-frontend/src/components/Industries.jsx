import { Container, Badge } from "react-bootstrap";
import { industries } from "../data/industriesData";

const Industries = () => {
  return (
    <section className="bg-info text-dark py-5">
      <Container className="text-center">
        <h2 className="mb-4">Industries We Serve</h2>

        {industries.map((item, index) => (
          <Badge bg="light text-dark" className="m-2 p-2" key={index}>
            {item}
          </Badge>
        ))}
      </Container>
    </section>
  );
};

export default Industries;
