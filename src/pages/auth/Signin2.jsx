import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Col, Form, Image, Row, Spinner } from "react-bootstrap";
import bg1 from "../../assets/img/bg1.jpg";
import { useLogin } from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import SEO from "../../components/SEO";
import InputWrapper from "../../components/InputWrapper";
import c1 from '../../assets/background/captcha/1.jpg'
import c2 from '../../assets/background/captcha/2.jpg'
import c3 from '../../assets/background/captcha/3.jpg'
import c4 from '../../assets/background/captcha/4.jpg'
import c5 from '../../assets/background/captcha/5.jpg'
import c6 from '../../assets/background/captcha/6.jpg'
import c7 from '../../assets/background/captcha/7.jpg'
import c8 from '../../assets/background/captcha/8.jpg'
import c9 from '../../assets/background/captcha/9.jpg'
import { useCallback } from "react";
import toast from "react-hot-toast";
import("./styleLogin.css")

const validation = () => {
  return Yup.object().shape({
    username: Yup.string().required("Harap isikan email anda"),
    password: Yup.string().required("Harap isikan password anda"),
    captcha: Yup.string().required("Harap isikan kode Captcha"),
  });
};

const rand = arr => arr[Math.floor(Math.random() * arr.length)]

function randomText(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const Signin2 = () => {
  const navigate = useNavigate();

  let [textCapt, setTextCapt] = useState({
    img: undefined,
    text: "",
    isLoad: false
  })
  let [bgCaptcha, setBgCaptcha] = useState(false)

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validation()),
    defaultValues: {
      username: "",
      password: "",
      captcha: ""
    },
  });
  console.log(errors);
  const styleBgCapt = useCallback(() => {
    const back = rand([c1, c2, c3, c4, c5, c6, c7, c8, c9])
    setBgCaptcha(back)
  }, [])

  const textToImage = useCallback(() => {
    setTextCapt(values => ({ ...values, isLoad: true }))
    let text = randomText(6)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = '1.5rem mom';
    ctx.fillText(text, 10, 50);
    setTimeout(() => {
      setTextCapt(values => ({ ...values, img: canvas.toDataURL(), text: text, isLoad: false }))
    }, 500)
  }, [])

  const { mutateAsync, isPending } = useLogin();
  const onSubmit = async (values) => {
    if (values.captcha == textCapt.text) {
      const toastId = toast.loading('Loading...');
      const response = await mutateAsync(values);
      console.log("response submit")
      console.log(response)
      if(response?.status == 200) {
        toast.dismiss(toastId)
        toast.success(response.message)
        navigate("/");
      } else {
        toast.dismiss(toastId)
        toast.error(response?.status + " - " + response?.message + (response?.message == "Password anda salah !" ? "" : "/User tidak ditemukan"))
        textToImage()
      }
    } else {
      toast.error("Captcha tidak sesuai")
    }
  }
  const isLoggedIn = localStorage.getItem("barantinToken");
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
    styleBgCapt()
    textToImage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, styleBgCapt, textToImage]);
  return (
    <div className="page-sign d-block py-0">
      <SEO title="Login" />
      <Row className="g-0">
        <Col md="7" lg="5" xl="4" className="col-wrapper">
          <Card className="card-sign">
            <Card.Header>
              <div className="d-flex justify-content-center mb-4">
                <Image src="/logo.png" width={200} height={200} />
              </div>
              <Card.Title className="fw-bold mb-1">PNBP Barantin</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <InputWrapper
                    error={!!errors?.username}
                    message={errors?.username?.message}
                  >
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      {...register("username")}
                      type="text"
                      placeholder="Username.."
                    />
                  </InputWrapper>
                </div>
                <div className="mb-4">
                  <InputWrapper
                    error={!!errors?.password}
                    message={errors?.password?.message}
                  >
                    <Form.Label className="d-flex justify-content-between">
                      Password
                    </Form.Label>
                    <Form.Control
                      {...register("password")}
                      type="password"
                      placeholder="Password.."
                    />
                  </InputWrapper>
                </div>
                <div className="row mb-4">
                  <div className="col-sm-5">
                    {textCapt.isLoad ?
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                      :
                      // <div className="d-flex justify-content-between">
                        <div className="image-wrapper mb-3 me-2">
                          <img src={bgCaptcha ? bgCaptcha : ""} className='image' />
                          <div className='ptext'>
                            {/* {textCapt.img ?  */}
                            <img src={textCapt.img} />
                            {/* : ""} */}
                          </div>
                        </div>
                      // </div>
                    }
                  </div>
                  <div className="col-sm-2">
                    <Button variant="outline-secondary" size="lg" active onClick={() => textToImage()}><i className="ri-refresh-line"></i></Button>
                    {/* <button type='button' onClick={() => textToImage()} className='btn btn-sm btn-secondary'><i className="ri-refresh-line"></i> </button> */}
                  </div>
                  <div className="col-sm-5">
                    <InputWrapper
                      error={!!errors?.captcha}
                      message={errors?.captcha?.message}
                    >
                    <Form.Control
                      {...register("captcha")}
                      type="text"
                      placeholder="Kode captcha.."
                    />
                    </InputWrapper>
                    {/* <input type="text" {...register("captcha", { required: "Mohon isi kode captcha." })} placeholder='Masukkan captcha..' autoComplete='off' className='form-control' />
                    {errors.captcha && <small className="text-danger" style={{ paddingLeft: "5px" }}>{errors.captcha.message}</small>} */}
                  </div>
                </div>
                <Button type={isPending ? "button" : "submit"} disabled={isPending} className="btn-sign">
                  {isPending ? "Loading.." : "Sign In"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col className="d-none d-lg-block">
          <img src={bg1} className="auth-img" alt="" />
        </Col>
      </Row>
    </div>
  );
};
export default Signin2;
