
import {
	Router,
} from 'express';

import vaults_chats_messages_create from './vaults/chats/messages/create';
import vaults_chats_messages_list_all from './vaults/chats/messages/list-all';

import vaults_chats_create from './vaults/chats/create';
import vaults_chats_delete from './vaults/chats/delete';
import vaults_chats_list_all from './vaults/chats/list-all';
import vaults_chats_get_one from './vaults/chats/get-one';
import vaults_chats_edit from './vaults/chats/edit';

import vaults_create from './vaults/create';
import vaults_edit from './vaults/edit';
import vaults_list_all from './vaults/list-all';


const router = Router();

router.get('/vault/:vaultId/chat/:chatId/messages', vaults_chats_messages_list_all);
router.post('/vault/:vaultId/chat/:chatId/message', vaults_chats_messages_create);

router.get('/vault/:vaultId/chats', vaults_chats_list_all);
router.get('/vault/:vaultId/chat/:chatId', vaults_chats_get_one);
router.post('/vault/:vaultId/chat', vaults_chats_create);
router.delete('/vault/:vaultId/chat/:chatId', vaults_chats_delete);
router.patch('/vault/:vaultId/chat/:chatId', vaults_chats_edit);

router.get('/vaults', vaults_list_all);
router.post('/vault', vaults_create);
router.patch('/vault/:vaultId', vaults_edit);

export {
	router,
};
