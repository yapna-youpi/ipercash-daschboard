export const setBuyDescription = (step) => {
    console.log("l'error step ", step)
    switch (step) {
        case "0":
            return (
                <span>
                    La transaction a échoué à la verification de l'adresse du client. Il n'y a eu ni prelèvement ni envoie de crypto. <br />
                    Utilisez la verification pour vous en assurer.
                </span>)
        case "1":
            return (
                <span>
                    La transaction a échoué par manque de fond pour l'effectuer. Il n'y a eu ni prelèvement ni envoie de crypto. <br />
                    Utilisez la verification pour vous en assurer.
                </span>)
        case "2":
            return (
                <span>
                    La transaction a échoué car le client n'a pas effectué le paiement. Il n'y a eu ni prelèvement ni envoie de crypto. <br />
                    Utilisez la verification pour vous en assurer.
                </span>)
        case "3":
            return (
                <span>
                    La transaction a échoué car nous n'avons pas pu envoyer la crypto. Le client a été prelevé. <br />
                    Utilisez la verification pour avoir plus de details.
                </span>)
        case "4":
            return (
                <span>
                    La transaction a échoué car nous n'avons pas pu envoyer la crypto. Le client a été prelevé. <br />
                    Utilisez la verification pour avoir plus de details.
                </span>)
        case "100" | undefined:
            return (
                <span>
                    La transaction s'est bien déroulé.
                </span>)
        case undefined:
            return (
                <span>
                    La transaction s'est bien déroulé.
                </span>)
        default:
            return (
                <span>
                    Utilisez la verification pour avoir la description de la transaction.
                </span>
            )
    }
}

export const setSellDescription = (step) => {
    console.log("l'error step ", step)
    switch (step) {
        case "init":
            return (
                <span>
                    La transaction a échoué au debut, le client n'a pas envoyé la crypto. <br />
                    Utilisez la verification pour vous en assurer.
                </span>)
        case "cancel":
            return (
                <span>
                    La transaction a échoué au debut, le client n'a pas envoyé la crypto ou sa transaction n'a pas été retrouvé. <br />
                    Utilisez la verification pour vous en assurer.
                </span>)
        case "unconfirmed":
            return (
                <span>
                    Le client a envoyé la crypto, le processus est en attente de confirmation. <br />
                    Utilisez la verification pour vous en assurer.
                </span>)
        case "confirmed":
            return (
                <span>
                    Le client a envoyé la crypto, le mobile money a été envoyé. <br />
                    Utilisez la verification pour vous en assurer.
                </span>)
        case "complete":
            return (
                <span>
                    La transaction c'est bien deroulé. <br />
                    Utilisez la verification pour vous en assurer.
                </span>)
        default:
            return (
                <span>
                    Utilisez la verification pour avoir la description de la transaction.
                </span>
            )
    }
}