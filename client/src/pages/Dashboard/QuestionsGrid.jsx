import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button/Button';

const getButtonText = (question) => {
  if (question.progress === 100) return 'Review';
  if (question.hasStarted || question.progress > 0) return 'Continue';
  return 'Start';
};

const QuestionCard = ({ question, onQuestionClick }) => (
  <Link
    to={`/questionnaire/${question.id}`}
    className="question-card"
  >
    <div className="question-card-image">
      {question.thumbnailUrl || question.imageUrl ? (
        <img
          src={question.thumbnailUrl || question.imageUrl}
          alt={question.title}
          className="question-image"
        />
      ) : (
        <div className="image-placeholder">
          <span className="placeholder-label">{question.id}</span>
        </div>
      )}
    </div>
    <div className="question-card-content">
      <div className="question-card-header">
        <span className="question-id">{question.id}</span>
        <h3 className="question-title">{question.title}</h3>
      </div>
      <p className="question-description">{question.description}</p>
      <div className="question-progress">
        <div className="progress-bar-small">
          <div
            className="progress-bar-fill-small"
            style={{ width: `${question.progress}%` }}
          />
        </div>
        <span className="progress-text">{question.layersCompleted}/{question.totalLayers} layers</span>
      </div>
      <Button
        variant={question.progress > 0 && question.progress < 100 ? 'secondary' : 'primary'}
        size="sm"
        fullWidth
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onQuestionClick(question.id);
        }}
      >
        {getButtonText(question)}
      </Button>
    </div>
  </Link>
);

const QuestionsGrid = ({ questions, onQuestionClick }) => {
  return (
    <section className="dashboard-section questions-section">
      <div className="section-header">
        <h2 className="section-title">Section 5. Advance Care Planning</h2>
      </div>
      <p className="section-description">
        These questions help you explore your values and preferences for medical care decisions.
      </p>

      {questions.length === 0 ? (
        <div className="questions-empty">
          <p>No questions available. Please check back later.</p>
        </div>
      ) : (
        <div className="questions-grid">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onQuestionClick={onQuestionClick}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default QuestionsGrid;
