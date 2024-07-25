import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  FormControl,
  Image,
  Row,
} from "react-bootstrap";
import { Label } from "reactstrap";
import { useGetUser } from "../../hooks/useAuth";

const Profile = () => {
  const user = useGetUser();
  return (
    <>
      <Container className="pt-5">
        <Card>
          <CardBody>
            <Row>
              <Col sm={12} md={4}>
                <Image src="" alt="user photo" />
              </Col>
              <Col sm={12} md={6}>
                <Row>
                  <Col sm={12} md={10} lg={8}>
                    <CardTitle className="fw-bold">User Profile</CardTitle>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col sm={12} md={10} lg={8}>
                    <Label>Nama</Label>
                    <FormControl disabled value={user?.name} />
                  </Col>
                </Row>
                <Row className="mt-1">
                  <Col sm={12} md={10} lg={8}>
                    <Label>Email</Label>
                    <FormControl disabled value={user?.email} />
                  </Col>
                </Row>
                <Row className="mt-1">
                  <Col sm={12} md={10} lg={8}>
                    <Label>Role</Label>
                    <FormControl disabled value={user?.role} />
                  </Col>
                </Row>
                <Row className="mt-1">
                  <Col sm={12} md={10} lg={8}>
                    <Label>Password</Label>
                    <FormControl />
                  </Col>
                  <Col sm={12} md={10} lg={8}>
                    <Label>Confirm Password</Label>
                    <FormControl />
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col
                    sm={12}
                    md={10}
                    lg={8}
                    className="d-flex justify-content-end"
                  >
                    <Button>Simpan</Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};
export default Profile;
