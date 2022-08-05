import { AlertDialog, Button } from 'react-onsenui'

export const AddDomainConfirm = ({
  onConfirm,
  onCancel,
  domainName,
  domainBid,
  isOpen,
}) => {
  return (
    <AlertDialog
      isOpen={isOpen}
      onCancel={onCancel}
      cancelable
      modifier="rowfooter"
    >
      <div className="alert-dialog-title">Confirmation</div>
      <div className="alert-dialog-content">
        Do you want to add “<strong>{domainName}</strong>”?
      </div>
      <div className="alert-dialog-footer">
        <Button destructive onClick={onCancel} className="alert-dialog-button">
          No
        </Button>
        <Button onClick={onConfirm} className="alert-dialog-button">
          Yes
        </Button>
      </div>
    </AlertDialog>
  )
}
