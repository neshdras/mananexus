import './toggleForm.scss'
const Switch = ({bool, setBool}) => {
  return (
    <label htmlFor="filter" className="form-switch" aria-label="Toggle Filter">
      <input className="form-switch__input" type="checkbox" id="filter" name="filter" onChange={()=> setBool(!bool)} />
      <span className="form-switch__option">Inscription</span>
      <span className="form-switch__option">Connexion</span>
    </label>
  );
}
export default  Switch
