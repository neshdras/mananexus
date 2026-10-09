import './toggleForm.scss'
const Switch = ({bool, setBool}) => {
  return (
    <label htmlFor="filter" className="switch" aria-label="Toggle Filter">
      <input type="checkbox" id="filter" name="filter" onChange={()=> setBool(!bool)} />
      <span>Inscription</span>
      <span>Connection</span>
    </label>
  );
}
export default  Switch