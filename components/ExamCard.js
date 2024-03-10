import { faClock, faInfo, faInfoCircle, faPerson, faShare, faUser } from '@fortawesome/free-solid-svg-icons';
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

  const formatDate = (date) => {
    const options = { month: 'short', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const shareLink = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this exam',
          text: `Check out this exam: ${exam.title}`,
          url: `${window.location.origin}/exam/${exam._id}`
        });
      } else {
        throw new Error('Web Share API not supported');
      }
    } catch (error) {
      console.error('Sharing failed:', error);
      try {
        await navigator.clipboard.writeText(`${window.location.origin}/${exam._id}/`);
        alert('Link copied to clipboard!');
      } catch (clipboardError) {
        console.error('Copying to clipboard failed:', clipboardError);
        alert('Sharing failed. Please copy the link manually.');
      }
    }
  };


  return (
    <div className="box-card" style={{ borderRadius: 0 }}>
      <div className="row">
        <div className="col-md-2 col-sm-3 col-xs-4">
          <div className="box-date text-center" style={{ borderRadius: 0 }}>
            <ul>
              <li className="t-date"><span>{new Date(exam.createdAt).getDate()}</span></li>
              <li className="t-month"><span>{formatDate(exam.createdAt)}</span></li>
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
                  <FontAwesomeIcon icon={faUser} />
                  <b>&nbsp;{exam.user.firstName} {exam.user.lastName} </b>
                </span>
                {/* <span style={{ color: "red" }}>
                  <FontAwesomeIcon icon={faClock} />
                  <span style={{ color: "red" }}> {exam.endTime} </span>
                </span> */}
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
            <Link type="button" className="btn-guest pull-right" style={{ borderRadius: 0, marginRight: '10px', textDecoration: 'none' }} href={'/quiz/' + exam._id}>
              <FontAwesomeIcon icon={faInfoCircle} /> Details
            </Link>
            <button type="button" className="btn-guest pull-right" style={{ borderRadius: 0, marginRight: '10px' }} onClick={shareLink}>
              <FontAwesomeIcon icon={faShare} /> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
