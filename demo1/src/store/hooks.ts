import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from './index'

// Typed hooks — use these instead of plain useDispatch / useSelector throughout the app
export const useAppDispatch = () => useDispatch<any>()
export const useAppSelector = <T>(selector: (state: RootState) => T): T => useSelector(selector as any)
