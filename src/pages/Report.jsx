import IssueForm from "../components/IssueForm";

function Report({ addIssue }) {
  return (
    <div className="p-6">
      <IssueForm addIssue={addIssue} />
    </div>
  );
}

export default Report;