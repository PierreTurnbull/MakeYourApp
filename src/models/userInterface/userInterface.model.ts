export type TUserInterfaceType = "textInput"

export type TUserInterface = {
	id: number
	type: TUserInterfaceType
	top: number
	left: number
	value: string | null
}