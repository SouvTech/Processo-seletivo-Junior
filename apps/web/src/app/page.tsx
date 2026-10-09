import FormularioLogin from '@/components/organisms/FormularioLogin/formularioLogin'
import AuthTemplate from '@/components/templates/AuthTemplate/authTemplate'

export default function LoginPage() {
  return (
    <AuthTemplate titulo="Clínica Bem Viver" subtitulo="Entre com seu e-mail e senha">
      <FormularioLogin />
    </AuthTemplate>
  )
}
