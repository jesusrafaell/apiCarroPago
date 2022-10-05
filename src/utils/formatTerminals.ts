import Abonos from '../db/models/Abonos';
import { TerminalSP_Veiws, TerminalStatus } from '../interfaces/terminals';

export const formatTerminals = (terminals: any[]) => {
	let list: any[] = [];
	for (let i = 0; i < terminals.length; i++) {
		list.push(terminals[i].id);
	}
	return list;
};

export const formatTerminalsFromAbono = (terminals: Abonos[]): string => {
	let list: string = '';
	for (let i = 0; i < terminals.length; i++) {
		list += `'${terminals[i].aboTerminal}'` + (i < terminals.length - 1 ? ',' : '');
	}
	return list;
};

export const formatTerminalsStatus = (terminals: TerminalSP_Veiws[] | []): TerminalStatus[] => {
	let list: TerminalStatus[] = [];
	for (let i = 0; i < terminals.length; i++) {
		list.push({
			terminal: terminals[i].id,
			status: terminals[i].term_active,
		});
	}
	return list;
};
