"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Copy, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

import { apiClient, getErrorDetail } from "@/api/client";
import type { components } from "@/api/schema";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { PageHeader } from "@/components/atoms/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireRole, useAuth } from "@/providers";

type InviteInfo = components["schemas"]["InviteInfo"];

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["editor", "viewer"]),
});

type InviteValues = z.infer<typeof inviteSchema>;

/**
 * `/app/users` — workspace invite management (admin only). Creates email-bound
 * invite codes, lists pending invites, copies invite URLs, and revokes them.
 * Port of mock `user-management-page.tsx`; the regenerated schema types these
 * endpoints directly, so the mock's `as unknown as {...}` casts are dropped.
 */
export const UsersTemplate = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const qc = useQueryClient();

  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [inviteDialogUrl, setInviteDialogUrl] = useState<string | null>(null);
  const [copiedInviteUrl, setCopiedInviteUrl] = useState(false);

  const form = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "", role: "viewer" },
  });

  const invites = useQuery({
    queryKey: ["invites", user?.tenant_id ?? ""],
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/api/v1/auth/invites");
      if (error) throw new Error(getErrorDetail(error));
      return data?.invites ?? [];
    },
    enabled: Boolean(user),
  });

  const inviteMutation = useMutation({
    mutationFn: async (values: InviteValues) => {
      const { data, error } = await apiClient.POST("/api/v1/auth/invite", {
        body: { email: values.email, role: values.role },
      });
      if (error) throw new Error(getErrorDetail(error));
      return data;
    },
    onSuccess: (data) => {
      form.reset();
      void qc.invalidateQueries({ queryKey: ["invites", user?.tenant_id ?? ""] });
      if (data?.invite_code) {
        const fullUrl = `${window.location.origin}/invite/${data.invite_code}`;
        setInviteDialogUrl(fullUrl);
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const revokeMutation = useMutation({
    mutationFn: async (tokenHash: string) => {
      const { error } = await apiClient.DELETE("/api/v1/auth/invites/{token_hash}", {
        params: { path: { token_hash: tokenHash } },
      });
      if (error) throw new Error(getErrorDetail(error));
    },
    onSuccess: () => {
      toast.success(t("auth.inviteRevoked"));
      void qc.invalidateQueries({ queryKey: ["invites", user?.tenant_id ?? ""] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function copyInviteUrl(url: string, shortCode: string) {
    void navigator.clipboard.writeText(url);
    setCopiedToken(shortCode);
    setTimeout(() => setCopiedToken(null), 2000);
  }

  function copyDialogUrl() {
    if (!inviteDialogUrl) return;
    void navigator.clipboard.writeText(inviteDialogUrl);
    setCopiedInviteUrl(true);
    setTimeout(() => setCopiedInviteUrl(false), 2000);
  }

  // Server-side tenant resolution means whoami carries the role; a non-admin
  // should never see this page, but the client guard keeps the layout honest.
  if (!user) return null;
  if (!requireRole(user, "admin")) {
    return <p className="text-sm text-muted-foreground">{t("common.loading")}</p>;
  }

  return (
    <div className="space-y-6">
      <Dialog
        open={Boolean(inviteDialogUrl)}
        onOpenChange={(open) => {
          if (!open) setInviteDialogUrl(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("users.inviteLinkTitle")}</DialogTitle>
            <DialogDescription>{t("users.inviteLinkDescription")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input readOnly value={inviteDialogUrl ?? ""} className="font-mono text-xs" />
            <Button type="button" onClick={copyDialogUrl}>
              {copiedInviteUrl ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {t("common.copied")}
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  {t("users.copyUrl")}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <PageHeader title={t("users.title")} subtitle={t("users.description")} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            {t("users.inviteTitle")}
          </CardTitle>
          <CardDescription>{t("users.inviteDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-wrap items-end gap-4" onSubmit={form.handleSubmit((v) => inviteMutation.mutate(v))}>
            <div className="min-w-0 flex-1 space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input id="email" type="email" {...form.register("email")} placeholder={t("users.emailPlaceholder")} />
            </div>
            <div className="w-40 space-y-2">
              <Label htmlFor="role">{t("users.role")}</Label>
              <Select value={form.watch("role")} onValueChange={(v) => form.setValue("role", v as "editor" | "viewer")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">{t("users.roleEditor")}</SelectItem>
                  <SelectItem value="viewer">{t("users.roleViewer")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" fullWidth={false} disabled={inviteMutation.isPending}>
              {inviteMutation.isPending ? t("common.loading") : t("users.sendInvite")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("users.pendingInvites")}</CardTitle>
          <CardDescription>{t("users.pendingDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {invites.isLoading ? (
            <p className="text-muted-foreground">{t("common.loading")}</p>
          ) : invites.data?.length === 0 ? (
            <p className="text-muted-foreground">{t("users.noInvites")}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("auth.email")}</TableHead>
                  <TableHead>{t("users.role")}</TableHead>
                  <TableHead>{t("users.expires")}</TableHead>
                  <TableHead className="w-24">{t("common.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invites.data?.map((invite: InviteInfo) => (
                  <TableRow key={invite.token_hash}>
                    <TableCell>{invite.email}</TableCell>
                    <TableCell className="capitalize">{invite.role}</TableCell>
                    <TableCell>{new Date(invite.expires_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          fullWidth={false}
                          onClick={() => copyInviteUrl(`${window.location.origin}/invite/${invite.short_code}`, invite.short_code)}
                          title={t("users.copyUrl")}
                        >
                          {copiedToken === invite.short_code ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          fullWidth={false}
                          onClick={() => revokeMutation.mutate(invite.token_hash)}
                          disabled={revokeMutation.isPending}
                          title={t("users.revoke")}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
