import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ExamCard = ({ exam, results }) => {
  const router = useRouter();

  const takeExam = () => {
    const winName = `MyWindow${exam._id}`;
    const winURL = `examInstructions/${exam._id}`;
    const windowOptions = 'resizable=yes,status=0,toolbar=0,scrollbars=1';
    const params = {
      exam: exam._id
    };

    const form = document.createElement('form');
    form.setAttribute("method", "post");
    form.setAttribute("action", winURL);
    form.setAttribute("target", winName);
    
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
      }
    }

    document.body.appendChild(form);
    window.open('', winName, windowOptions);
    form.target = winName;
    form.submit();
    form.reset();
  };

  return (
    <div className="box-card" style={{ borderRadius: 0 }}>
      <div className="row">
        <div className="col-md-2 col-sm-3 col-xs-4">
          <div className="box-date text-center" style={{ borderRadius: 0 }}>
            <ul>
              <li className="t-date"><span> 17 </span></li>
              <li className="t-month"><span> JAN 2023 </span></li>
            </ul>
          </div>
        </div>
        <div className="col-md-6 col-sm-6 col-xs-8">
          <div className="box-subject">
            <ul>
              <li className="t-subject">
                <span className="left"> {exam.title} </span>
                <span className="t-time" style={{ color: "red" }}>
                  &nbsp;<FontAwesomeIcon icon={faClock} />
                  <span>&nbsp;{exam.duration} min </span>
                </span>
              </li>
              <li className="t-time">
                <span style={{ color: "green" }}>
                  <FontAwesomeIcon icon={faClock} />
                  <span>&nbsp;{exam.startTime} -&nbsp; </span>
                </span>
                <span style={{ color: "red" }}>
                  <FontAwesomeIcon icon={faClock} />
                  <span style={{ color: "red" }}> {exam.endTime} </span>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-md-4 col-sm-3">
          <div className="box-button">
            {!results ? <button type="button" className="btn-guest pull-right" style={{ borderRadius: 0 }} onClick={takeExam}>
              TAKE EXAM
            </button> : 
            <Link href={'/results/' + exam._id} className='btn-guest pull-right' style={{ borderRadius: 0 }}>Results</Link>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
