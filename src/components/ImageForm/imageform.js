import './imageform.css';
const ImageForm=({onInputChange,onButtonClick})=>{
    return (
       <div>
           <p className='f3'>
               {'This Magic Brain detects faces in pictures. Give it a Try!'}
           </p>
           <div className='center'>
                <div className='form br3 center shadow-5 pa4'>
                    <input className='f4 pa2 w-70 center' type='text' onChange={onInputChange}></input>
                    <button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple' onClick={onButtonClick}>Detect</button>
                </div>
           </div>
       </div>
    );
}
export default ImageForm;