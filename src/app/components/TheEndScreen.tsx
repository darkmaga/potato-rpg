type Props = {
  message: string
  restart: () => void
}

const TheEnd = ({ message, restart }: Props) => {
  return (
    <div className='h-full w-full fixed z-10 flex flex-col gap-8 items-center justify-center bg-black bg-opacity-75'>
      <h1 className='text-white text-5xl'>The end</h1>
      <span className='p-24 bg-white rounded-xl'>{message}</span>
      <button className='bg-white p-3 rounded-xl' onClick={restart}>
        Restart
      </button>
    </div>
  )
}

export default TheEnd
