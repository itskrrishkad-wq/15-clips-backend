import AdStatPage from '@/components/ads/AdState'



type Props = {
    params: Promise<{
        id: string
    }>
}
const AdPage = async ({ params }: Props) => {
    const { id } = await params;
    return (
        <AdStatPage id={id} />
    )
}

export default AdPage