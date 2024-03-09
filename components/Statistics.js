import React from 'react';
import Swal from 'sweetalert2';

const StatisticsOverlay = ({ statistics, onClose, onSubmit }) => {
    const handleConfirmSubmit = () => {
        Swal.fire({
            title: 'Submit Answers?',
            text: 'Are you sure you want to submit your answers?',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        })
        .then((willSubmit) => {
            if (willSubmit) {
                onSubmit();
            }
        });
    };

    return (
        <div className="modal fade" id="statisticsModal" tabIndex="-1" aria-labelledby="statisticsModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="statisticsModalLabel">Statistics</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Attempted</th>
                                    <th>Marked For Review</th>
                                    <th>Saved</th>
                                    <th>Not Attempted</th>
                                </tr>
                            </thead>
                            <tbody>
                                {statistics.map((stat, index) => (
                                    <tr key={index}>
                                        <td>{stat.subject}</td>
                                        <td>{stat.attempted}</td>
                                        <td>{stat.markedForReview}</td>
                                        <td>{stat.saved}</td>
                                        <td>{stat.notAttempted}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                        <button type="button" className="btn btn-success" onClick={handleConfirmSubmit}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsOverlay;
