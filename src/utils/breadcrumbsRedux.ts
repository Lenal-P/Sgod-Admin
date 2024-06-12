export const saveDataToSession = (data: any) => {
    sessionStorage.setItem("breadcrumbs", JSON.stringify(data.data))
}