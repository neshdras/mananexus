import { useState } from 'react'
import {Formik, Field, Form, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import './App.css'

function App() { 
  const [value, setValue] = useState(null)
  return (
    <>
    <h1>Formulaire formik</h1>
    <Formik
      initialValues= {{firstName: '', lastName: '', email: ''}}
      validationSchema= {Yup.object({
      firstName: Yup.string()
      .max(15, 'Must be 15 character or less')
      .required('Required'),
      lastName: Yup.string()
      .max(20, 'Must be 20 characters or less')
      .required('Required'),
      pseudo: Yup.string().min(3),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8}$/)
    })}
    onSubmit={(values, {setSubmitting}) => {
      setTimeout(()=>{
        setValue(values)
        setSubmitting(false)
      }, 400)
    }}
    >
      <Form>
        <label htmlFor="firstName">First name</label>
        <Field name= "firstName" type="text"/>
        <ErrorMessage name='firstName'/>
        <br />
        <label htmlFor="lastName">Last name</label>
        <Field name= "lastName" type="text"/>
        <ErrorMessage name='lastName'/>
        <br />
        <label htmlFor="pseudo">Pseudo (optionnel)</label>
        <Field name= "pseudo" type="text"/>
        <ErrorMessage name='pseudo'/>
        <br />
        <label htmlFor="email">email</label>
        <Field name= "email" type="email"/>
        <ErrorMessage name='email'/>
        <br />
        <label htmlFor="password">Mot de passe</label>
        <Field name= "password" type="password"/>
        <ErrorMessage name='password'/>
        <br />
        <button type="submit">Submit</button>
      </Form>
    </Formik>
    <ul>
      <li>firstName : {value?.firstName}</li>
      <li>lastName : {value?.lastName}</li>
      <li>pseudo : {value?.pseudo}</li>
      <li>email : {value?.email}</li>
      <li>Mot de passe : {value?.password}</li>
    </ul>
    </>
  )
}

export default App
