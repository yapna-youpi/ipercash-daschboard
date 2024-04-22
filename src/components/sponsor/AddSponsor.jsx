import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import ReactLoading from 'react-loading'

import { Input2 } from '../shared/input/Input'

import './addsponsor.css'

const validationSchema = yup.object({
    code: yup.string().length(7, "Le code doit avoir 7 carateres").required('Le code est requis'),
    percent: yup.number().min(0.1, "Le pourcentage doit etre supperieur a 0").required("Le pourcentage est requis"),
    owner: yup.string().required('Le nom promoteur est requis'),
    phone: yup.string().min(9, 'Le numero doit avoir au moins 9 caracteres').required('Le numero est requis'),
    email: yup.string().email("L'email doit etre valide").required("L'email est requis"),
})

function AddSponsor({ add, close }) {
    const [loading, setLoading] = useState(false)
    // const [state, setState] = useState({})
    const formik = useFormik({
        initialValues: {
            code: "",
            percent: 0,
            owner: "",
            phone: "",
            email: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            console.log("the values ", values)
            await add(values)
            close()
        }
    })

    return (
        <div className="addcode">
            <h2>Creer un nouveau code promo</h2>
            <div className="form">
                <h3>Details du code</h3>
                <div className="code">
                    <div className="input-group">
                        <Input2 label="Code du parrain" name="code" type="text" val={formik.values.code}
                            error={formik.errors.code && formik.touched.code} help={formik.errors.code}
                            handBlur={formik.handBlur} change={formik.handleChange} />
                    </div>
                    <div className="input-group">
                        <Input2 label="Pourcentage (en %)" name="percent" type="number" val={formik.percent}
                            error={formik.errors.percent && formik.touched.percent} help={formik.errors.percent}
                            handBlur={formik.handBlur} change={formik.handleChange} />
                    </div>
                </div>
                <h3>Informations du promotteur</h3>
                <div className="owner">
                    <Input2 label="Nom du promoteur" name="owner" val={formik.values.owner} type="text"
                        error={formik.errors.owner && formik.touched.owner} help={formik.errors.owner}
                        handBlur={formik.handBlur} change={formik.handleChange} />
                    <Input2 label="Numero de Telephone" name="phone" type="phone" val={formik.values.phone}
                        error={formik.errors.phone && formik.touched.phone} help={formik.errors.phone}
                        handBlur={formik.handBlur} change={formik.handleChange} />
                    <Input2 label="Adresse email" name="email" type="email" val={formik.values.email}
                        error={formik.errors.email && formik.touched.email} help={formik.errors.email}
                        handBlur={formik.handBlur} change={formik.handleChange} />
                </div>
                <button onClick={formik.handleSubmit}>
                    {loading ? <ReactLoading type="spin" color='#FFF' height={15} width={15} /> : "Enregistrer"}
                </button>
            </div>
        </div>
    )
}

export default AddSponsor