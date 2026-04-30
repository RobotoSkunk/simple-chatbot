
import {
	Router,
} from 'express';

import messages_getAskMiddleware from './vaults/chats/messages/ask';
import messages_list_all from './vaults/chats/messages/list-all';
import messages_edit from './vaults/chats/messages/edit';
import messages_delete from './vaults/chats/messages/delete';
import messages_set_index from './vaults/chats/messages/set-index';

import chats_create from './vaults/chats/create';
import chats_delete from './vaults/chats/delete';
import chats_list_all from './vaults/chats/list-all';
import chats_get_one from './vaults/chats/get-one';
import chats_edit from './vaults/chats/edit';

import vaults_create from './vaults/create';
import vaults_edit from './vaults/edit';
import vaults_list_all from './vaults/list-all';


const router = Router();

router.get('/vault/:vaultId/chat/:chatId/messages', messages_list_all);
router.post('/vault/:vaultId/chat/:chatId/message', messages_getAskMiddleware(true));
router.post('/vault/:vaultId/chat/:chatId/message/:messageId/regenerate', messages_getAskMiddleware(false));
router.patch('/vault/:vaultId/chat/:chatId/message/:messageId', messages_edit);
router.delete('/vault/:vaultId/chat/:chatId/message/:messageId', messages_delete);
router.post('/vault/:vaultId/chat/:chatId/message/:messageId/set-index', messages_set_index);

router.get('/vault/:vaultId/chats', chats_list_all);
router.get('/vault/:vaultId/chat/:chatId', chats_get_one);
router.post('/vault/:vaultId/chat', chats_create);
router.delete('/vault/:vaultId/chat/:chatId', chats_delete);
router.patch('/vault/:vaultId/chat/:chatId', chats_edit);

router.get('/vaults', vaults_list_all);
router.post('/vault', vaults_create);
router.patch('/vault/:vaultId', vaults_edit);

export {
	router,
};
